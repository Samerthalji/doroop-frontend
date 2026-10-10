import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const teamMembers = [
  { name: 'Abdalrahman Baker', email: 'Abdalrahman05@gmail.com' },
  { name: 'Suhaib al-Khalidy', email: 'suhaibkhaled@gmail.com' },
  { name: 'Samer Thalje', email: 'SamerThalje@gmail.com' },
  { name: 'Khaled Abu Baker', email: 'kkhalidAbubaker@gmail.com' },
  { name: 'Malek al-Alajarmeh', email: 'Malekajarmeh@gmail.com' },
];

const seekerFeatures = [
  { title: 'Limitless Opportunities', desc: 'Explore thousands of job listings updated daily across all industries to find your perfect match' },
  { title: 'Global Reach', desc: 'Connect with top-tier international companies and industry leaders looking for talents like you' },
  { title: 'Professional Community', desc: 'Join a vast network of job seekers and professionals to share insights and expand your career circle' },
  { title: 'Application Tracking', desc: "Track your application every step of the way—from 'Applied' to 'Interview'" },
  { title: 'Upload Your Skills', desc: "Track your application every step of the way—from 'Applied' to 'Interview'" },
  { title: 'Skill Exchange', desc: 'Share your expertise and learn from industry leaders.' },
];

const employerFeatures = [
  { title: 'Effortless Job Posting', desc: 'Create and publish your job openings in minutes with our streamlined editor' },
  { title: 'Applicant Tracking', desc: 'Review all applicants in one place. Access detailed profiles and resumes' },
  { title: 'Employer Dashboard', desc: "Get a bird's-eye view of your hiring process. Monitor active jobs, total applicants" },
  { title: 'Status Tracking', desc: 'Easily manage the hiring pipeline. Update applicant statuses' },
  { title: 'Company Branding', desc: 'Build a compelling employer profile. Showcase your company culture, values' },
  { title: 'Advanced Search', desc: 'Find exactly who you need. Use powerful filters to sort applicants by skills, experience level' },
];

const companies = ['clickup', 'airtable', 'miro', 'slack', 'huawei', 'asana'];

export default function LandingPage() {
  return (
    <div className="bg-gray-50 overflow-x-hidden">
      <Navbar />

      <div className="flex flex-col justify-center items-center pt-16">

        {/* Hero */}
        <section className="flex flex-col items-center w-full text-sm bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center bg-no-repeat">
          <div className="flex justify-center items-center gap-2 my-36 flex-wrap w-full">
            <main className="flex flex-col items-center w-1/3 max-md:px-2">
              <h1 className="text-center text-2xl md:text-4xl lg:text-6xl font-semibold text-slate-900">
                Find your next career move with ease
              </h1>
              <p className="text-left text-base text-slate-700 max-w-lg mt-2">
                Discover thousands of job opportunities from top companies, all in one place. Your dream job is just a click away.
              </p>
              <div className="flex items-center gap-4 mt-8">
                <Link to="/signup">
                  <button className="flex items-center gap-2 bg-blue-800 hover:bg-indigo-700 text-white active:scale-95 rounded-lg px-10 h-11">
                    Get started
                  </button>
                </Link>
              </div>
            </main>
            <div className="hidden md:block">
              <img src="/5.png" alt="" className="w-full" />
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-10 max-md:px-4 my-32">
          <div className="relative shadow-2xl shadow-indigo-600/40 rounded-2xl overflow-hidden shrink-0">
            <img className="max-w-md w-96 object-cover rounded-2xl" src="/landing-hero.webp" alt="" />
          </div>
          <div className="text-sm text-slate-600 max-w-lg p-2">
            <h1 className="text-xl uppercase font-semibold text-slate-700">What we do?</h1>
            <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-indigo-600 to-[#DDD9FF]"></div>
            <p className="mt-8 leading-7">Doroop serves as the bridge between ambitious talent and top-tier organizations. We simplify the recruitment journey by providing a seamless, data-driven platform where professional paths cross.

              Whether you're a recent graduate looking for your first break or a senior developer seeking a new challenge, our platform is designed to personalize your job search and match you with opportunities that align with your skills.

              From automated matching to career insights, Doroop empowers you to take the next step in your professional journey with confidence.</p>
            <a href="#" className="flex items-center w-max gap-2 mt-8 hover:-translate-y-0.5 transition bg-gradient-to-r from-indigo-600 to-[#8A7DFF] py-3 px-8 rounded-full text-white">
              <span>Read more</span>
              <svg width="13" height="12" viewBox="0 0 13 12" fill="none"><path d="M12.53 6.53a.75.75 0 0 0 0-1.06L7.757.697a.75.75 0 1 0-1.06 1.06L10.939 6l-4.242 4.243a.75.75 0 0 0 1.06 1.06zM0 6v.75h12v-1.5H0z" fill="#fff" /></svg>
            </a>
          </div>
        </section>

        {/* Job Seeker Features */}
        <div className="container mx-auto px-4 flex flex-col my-20">
          <div>
            <h2 className="text-5xl font-bold text-gray-800 text-center">
              Job Seeker <span className="text-indigo-600">Features</span>
            </h2>
          </div>
          <div className="flex justify-center flex-wrap items-center gap-6 my-10 mx-2">
            {seekerFeatures.map((f, i) => (
              <div key={i} className="flex flex-col justify-center items-center hover:-translate-y-1 transition duration-300 bg-white border-2 border-indigo-400 rounded-md shadow-lg shadow-gray-400 w-96 h-72 p-5 gap-3">
                <div className="rounded-full bg-indigo-400 p-5 w-15 h-15">
                  <i className="fa-solid fa-briefcase text-indigo-950 text-3xl"></i>
                </div>
                <h1 className="text-indigo-950 text-2xl text-center font-bold">{f.title}</h1>
                <p className="text-center text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Employer Features */}
        <div className="container mx-auto px-4 flex flex-col my-20">
          <div>
            <h2 className="text-5xl font-bold text-gray-800 text-center">
              Employer <span className="text-indigo-600">Features</span>
            </h2>
          </div>
          <div className="flex justify-center flex-wrap items-center gap-6 my-10 mx-2">
            {employerFeatures.map((f, i) => (
              <div key={i} className="flex flex-col justify-center items-center hover:-translate-y-1 transition duration-300 bg-white border-2 border-indigo-400 rounded-md shadow-lg shadow-gray-400 w-96 h-72 p-5 gap-3">
                <div className="rounded-full bg-indigo-400 p-5 w-15 h-15">
                  <i className="fa-solid fa-briefcase text-indigo-950 text-3xl"></i>
                </div>
                <h1 className="text-indigo-950 text-2xl text-center font-bold">{f.title}</h1>
                <p className="text-center text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <section className="py-20 bg-white my-32 mx-6 border border-gray-500 shadow-lg shadow-gray-600 rounded-lg w-full max-w-5xl">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-indigo-600 font-semibold tracking-widest uppercase text-sm">How it works</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4">Start Your Journey in 3 Easy Steps</h2>
              <p className="text-gray-500 max-w-xl mx-auto text-lg">Your next career move is just a few clicks away.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-indigo-50 -z-10"></div>
              {[
                { n: 1, title: 'Create Account', desc: 'Register your basic details and join our network of professionals.', solid: true },
                { n: 2, title: 'Build Profile', desc: 'Complete your profile with your experience and skills to get noticed by employers.', solid: false },
                { n: 3, title: 'Get Hired', desc: 'Apply for the jobs that match your goals and start your new professional chapter.', solid: true },
              ].map(step => (
                <div key={step.n} className="flex flex-col items-center text-center group">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300 ${step.solid ? 'bg-blue-800 text-white' : 'bg-white border-4 border-blue-800 text-blue-800'}`}>
                    {step.n}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-16 text-center">
              <Link to="/signup" className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-1">
                Get Started Now
              </Link>
            </div>
          </div>
        </section>

        {/* Team */}
        <div className="flex flex-col justify-center items-center flex-wrap w-full gap-20 mx-6 my-32 p-10">
          <h1 className="text-center text-5xl font-extrabold text-indigo-800">Our Team</h1>
          <div className="flex flex-row justify-center items-center flex-wrap gap-3">
            {teamMembers.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl pb-4 overflow-hidden border border-gray-200 hover:-translate-y-1 transition duration-300">
                <img className="w-64 h-52 object-cover object-top" src="/userProfiel.png" alt="teamMember" />
                <div className="flex flex-col items-center">
                  <p className="font-medium mt-3 text-blue-800">{member.name}</p>
                  <p className="text-gray-500 text-sm">{member.email}</p>
                  <button className="border text-sm text-blue-800 border-gray-200 hover:bg-gray-100 transition cursor-pointer px-6 py-1 rounded-full mt-5">
                    message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trusted Companies */}
        <section className="flex flex-col items-center justify-center px-4 my-32 mx-5 md:px-0 w-full">
          <h3 className="text-3xl font-bold text-blue-800 text-center">Trusted by world's leading companies</h3>
          <div className="max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full my-14">
            {companies.map(c => (
              <div key={c} className="border border-gray-200 p-4 h-15 grid place-content-center rounded-md hover:-translate-y-0.5 transition duration-200">
                <img src={`https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/${c}.svg`} alt={c} />
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
