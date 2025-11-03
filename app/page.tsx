import Image from 'next/image';
import { ChevronRight, BookOpen } from 'lucide-react';
import { getSections } from '../lib/data-manager';
import type { SectionListing } from '../lib/types';

export default async function Home() {
  const sections = await getSections().catch((err) => {
    console.error('Failed to load sections:', err);
    return [] as SectionListing[];
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}

      {/* Hero Section */}
      <section className="pt-15 bg-blue-50 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-blue-500 leading-tight mb-6">Master Your TOEFL Score Prepare for iBT & ITP.</h1>
              <p className="text-xl text-gray-600 mb-8">
                <span className="font-bold">100+ </span>
                of lessons covering all sections: Reading, Listening, Speaking, Writing, and Structure. Learn from TOEFL experts and ace your test.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-blue-500 font-bold text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                  View Courses
                  <ChevronRight className="w-5 h-5" strokeWidth={3} />
                </button>
                <button className="px-8 py-4 border border-blue-500 font-bold text-blue-500 rounded-lg hover:bg-blue-50 transition-colors">How it Works</button>
              </div>
              {/* Trust Indicators */}
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <p className="text-3xl font-bold text-gray-900">1000+</p>
                  <p className="text-gray-600">Courses to choose from</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">5000+</p>
                  <p className="text-gray-600">Students Trained</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">200+</p>
                  <p className="text-gray-600">Professional Trainers</p>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image/Illustration */}
            <div className="relative">
              <Image src="/assets/images/side_content.png" alt="content illustration" width={1200} height={900} className="w-full h-auto max-w-2xl mx-auto" priority />
            </div>
          </div>
        </div>
      </section>

      {/* Master Every Skill Section */}
      <section className="pt-16 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold text-blue-500 mb-4">Master Every Skill</h2>
            <p className="text-2xl text-gray-600">Our curriculum is focused on the three core pillars of the ITP test. Choose your focus to begin.</p>
          </div>

          {/* Skill Cards (from Sanity sections) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections && sections.length > 0 ? (
              sections.slice(0, 3).map((sec: SectionListing) => {
                const descriptionText = (() => {
                  const d = sec.description as unknown;
                  if (!d) return 'No description available';
                  if (typeof d === 'string') return d;
                  if (Array.isArray(d)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const first = d[0] as any;
                    if (first?.children && Array.isArray(first.children)) {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      return first.children.map((c: any) => c.text || '').join('');
                    }
                    if (typeof first === 'string') return first;
                  }
                  return 'No description available';
                })();

                return (
                  <div key={sec._id} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm mb-6">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 leading-snug mb-3">{sec.name}</h3>
                    <p className="text-gray-600 mb-6">{descriptionText}</p>
                    <a href={`/section/${sec.slug}`} className="group inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                      Start Learning
                      <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 col-span-3">No sections found.</p>
            )}
          </div>

          {/* See More Button */}
          <div className="text-center mt-6">
            <button className="px-10 py-2 font-semibold bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
              See More
            </button>
          </div>
        </div>
      </section>

      {/* Ready To Test Banner */}
      <section className="pt-6 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-50 rounded-2xl shadow-sm p-10 md:p-14 text-center">
            <h3 className="text-3xl md:text-4xl font-extrabold text-blue-600 leading-tight mb-4">
              Ready to Test Your
              <br />
              Skills?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Once you&apos;ve mastered the parts, try our full-length TOEFL ITP
              simulation tests to check your score.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 font-semibold">
              Take a Full Practice Test
            </button>
          </div>
        </div>
      </section>
      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}
