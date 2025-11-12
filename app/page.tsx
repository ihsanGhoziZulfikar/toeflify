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
              <h1 className="text-3xl lg:text-4xl font-extrabold text-primary leading-tight mb-6 font-rowdies">Master Your TOEFL Score Prepare for iBT & ITP.</h1>
              <p className="text-xl text-gray-600 mb-8 font-saira">
                <span className="font-bold">100+ </span>
                of lessons covering all sections: Reading, Listening, Speaking, Writing, and Structure. Learn from TOEFL experts and ace your test.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 font-open-sans">
                <button className="px-8 py-4 bg-primary font-bold text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer">
                  View Courses
                  <ChevronRight className="w-5 h-5" strokeWidth={3} />
                </button>
                <button className="px-8 py-4 border border-primary font-bold text-primary rounded-lg hover:bg-white transition-colors cursor-pointer">How it Works</button>
              </div>
              {/* Trust Indicators */}
              <div className="mt-12 flex items-center gap-8">
                <div className='w-1/3'>
                  <p className="text-3xl font-bold text-warning font-outfit">1000+</p>
                  <span className="text-black font-saira">Courses to choose from</span>
                </div>
                <div className='w-1/3'>
                  <p className="text-3xl font-bold text-primary font-outfit">5000+</p>
                  <span className="text-black font-saira">Students Trained</span>
                </div>
                <div className='w-1/3'>
                  <p className="text-3xl font-bold text-danger font-outfit">200+</p>
                  <span className="text-black font-saira">Professional Trainers</span>
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
            <h2 className="text-4xl font-extrabold text-primary mb-4 font-rowdies">Master Every Skill</h2>
            <p className="text-xl text-gray-600 font-saira">Our curriculum is focused on the three core pillars of the ITP test. Choose your focus to begin.</p>
          </div>

          {/* Skill Cards (from Sanity sections) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections && sections.length > 0 ? (
              sections.slice(0, 3).map((sec: SectionListing) => {
                return (
                  <div key={sec._id} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm mb-6">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 leading-snug mb-3 font-rowdies">{sec.name}</h3>
                    <p className="text-gray-600 mb-6 font-saira">{sec.excerpt}</p>
                    <a href={`/section/${sec.slug}`} className="group inline-flex items-center text-primary font-semibold hover:text-blue-700 transition-colors font-saira">
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
            <button className="px-10 py-2 font-semibold bg-primary text-white rounded-lg shadow cursor-pointer hover:bg-blue-600 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
              See More
            </button>
          </div>
        </div>
      </section>

      {/* Ready To Test Banner */}
      <section className="pt-6 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-50 rounded-2xl shadow-sm p-10 md:p-14 text-center">
            <h3 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight mb-4">
              Ready to Test Your
              <br />
              Skills?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">Once you&apos;ve mastered the parts, try our full-length TOEFL ITP simulation tests to check your score.</p>
            <button className="px-6 py-3 bg-primary text-white rounded-full shadow hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 font-semibold cursor-pointer">
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
