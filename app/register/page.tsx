'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

interface Slide {
  image: string;
  title: string;
  description: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          fullName: fullName,
          password: password,
          confirmPassword: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = data.error;

        if (data.details) {
          const firstErrorKey = Object.keys(
            data.details
          )[0] as keyof typeof data.details;
          if (data.details[firstErrorKey]) {
            errorMsg = data.details[firstErrorKey][0];
          }
        }

        setErrorMessage(errorMsg);
      } else {
        setSuccessMessage(data.message);

        setEmail('');
        setFullName('');
        setPassword('');
        setConfirmPassword('');

        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Register request failed:', error);
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

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-6 py-12 min-h-screen bg-white">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-center">
          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-500">
              Create Your Account!
            </h2>
            <p className="text-slate-600 font-semibold mt-2 text-sm sm:text-base">
              Sign up to access website
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-3">
              {errorMessage}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 text-green-700 text-sm text-center bg-green-50 border border-green-200 rounded-lg p-3">
              {successMessage}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8">
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  className="block text-slate-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Fullname */}
              <div>
                <label
                  className="block text-slate-700 text-sm font-bold mb-2"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  id="fullName"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                  placeholder="At least 8 character"
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

              {/* Confirm Password */}
              <div className="relative">
                <label
                  className="block text-slate-700 text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="At least 8 character"
                  className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500 focus:outline-none hover:text-gray-700"
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  !email ||
                  !fullName ||
                  !password ||
                  !confirmPassword ||
                  loading
                }
                className={`h-10 px-6 w-full rounded-md font-semibold text-white transition-all duration-300 transform flex items-center justify-center gap-2 ${
                  !email ||
                  !fullName ||
                  !password ||
                  !confirmPassword ||
                  loading
                    ? 'bg-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-blue-500 hover:bg-blue-600 hover:shadow-xl hover:scale-105 active:scale-95 shadow-lg'
                }`}
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loading ? 'Creating Account...' : 'Register'}
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
              <button
                type="button"
                onClick={() => {
                  // Dummy Google register
                  console.log('Google register clicked');
                }}
                className="w-full h-10 px-6 border border-gray-300 rounded-md font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Login Link */}
              <p className="text-slate-600 text-center mt-4 text-sm">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="font-bold text-[#4682A9] hover:underline"
                >
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
