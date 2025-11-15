'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { useUserStore } from '@/lib/store/userStore';
import GoogleAuthButton from '@/components/GoogleAuthButton';

interface Slide {
  image: string;
  title: string;
  description: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides: Slide[] = [
    {
      image: '/assets/images/login-1.png',
      title: 'Stay Curious',
      description:
        'Learn English easily and effectively, anytime and anywhere.',
    },
    {
      image: '/assets/images/login-2.png',
      title: 'Practice Makes Perfect',
      description: 'Sharpen your skills with daily TOEFL-style exercises.',
    },
    {
      image: '/assets/images/login-1.png',
      title: 'Track Your Progress',
      description: 'Monitor your learning journey and achievements over time.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const setProfile = useUserStore((state) => state.setProfile);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = data.error;

        if (data.details) {
          if (data.details.email) {
            errorMsg = data.details.email[0];
          } else if (data.details.password) {
            errorMsg = data.details.password[0];
          }
        }

        setErrorMessage(errorMsg);
      } else {
        setProfile(data.user);

        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Login request failed:', error);
      setErrorMessage(
        'An unexpected network error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Side - Carousel */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-blue-500 flex-col justify-center items-center text-white transition-all duration-700 ease-in-out">
        <div className="relative w-[300px] h-[300px] mb-8">
          <Image
            src={slides[currentIndex].image}
            alt="Illustration"
            fill
            className="object-contain transition-all duration-700 ease-in-out"
            priority
          />
        </div>
        <h2 className="text-2xl font-bold">{slides[currentIndex].title}</h2>
        <p className="mt-4 text-center px-8">
          {slides[currentIndex].description}
        </p>

        <div className="flex space-x-2 mt-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex ? 'bg-white' : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-6 py-12 min-h-screen bg-white">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-center">
          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-500">
              Welcome Back!
            </h2>
            <p className="text-slate-600 font-semibold mt-2 text-sm sm:text-base">
              Learn English Anytime, Anywhere.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-3">
              {errorMessage}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  className="block text-slate-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label
                  className="block text-slate-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="*********"
                  className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500 focus:outline-none hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!email || !password || loading}
                className={`h-10 px-6 w-full rounded-md font-semibold text-white transition-all duration-300 transform flex items-center justify-center gap-2 ${
                  !email || !password || loading
                    ? 'bg-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-blue-500 hover:bg-blue-600 hover:shadow-xl hover:scale-105 active:scale-95 shadow-lg'
                }`}
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loading ? 'Logging in...' : 'Login'}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or Continue With
                  </span>
                </div>
              </div>

              {/* Google Sign In Button */}
              <GoogleAuthButton />

              {/* Register Link */}
              <p className="text-slate-600 text-center mt-4 text-sm">
                Don&apos;t have an account?{' '}
                <a
                  href="/register"
                  className="font-bold text-[#4682A9] hover:underline"
                >
                  Register
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
