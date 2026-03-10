import React from "react";

const Features = () => {
  return (
    <section className="flex flex-col gap-6 mt-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
        Powerful Interview Preparation
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main large feature */}
        <div className="col-span-1 md:col-span-3 flex flex-col md:flex-row gap-6 p-8 bg-neutral-900/40 rounded-2xl border border-neutral-800/50 hover:bg-neutral-800/60 hover:border-neutral-700 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-300 group">
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform origin-left duration-300">🤖</div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 mb-2">
              AI Mock Interviews
            </h3>
            <p className="text-neutral-400 text-lg">
              Practice realistic AI-generated technical interview questions tailored exactly to your targeted role and experience level.
            </p>
          </div>
        </div>

        {/* 3 Smaller Features */}
        <div className="col-span-1 flex flex-col gap-4 p-6 bg-neutral-900/40 rounded-2xl border border-neutral-800/50 hover:bg-neutral-800/60 hover:border-neutral-700 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="text-3xl group-hover:scale-110 transition-transform origin-left duration-300 z-10">📄</div>
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 z-10">
            Resume-Based Interviews
          </h3>
          <p className="text-neutral-400">
            Upload your resume and generate personalized questions directly based on your skills and projects.
          </p>
        </div>

        <div className="col-span-1 flex flex-col gap-4 p-6 bg-neutral-900/40 rounded-2xl border border-neutral-800/50 hover:bg-neutral-800/60 hover:border-neutral-700 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="text-3xl group-hover:scale-110 transition-transform origin-left duration-300 z-10">⚡</div>
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 z-10">
            Instant AI Feedback
          </h3>
          <p className="text-neutral-400">
            Receive detailed, actionable feedback after each interview to identify weaknesses and improve faster.
          </p>
        </div>

        <div className="col-span-1 flex flex-col gap-4 p-6 bg-neutral-900/40 rounded-2xl border border-neutral-800/50 hover:bg-neutral-800/60 hover:border-neutral-700 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="text-3xl group-hover:scale-110 transition-transform origin-left duration-300 z-10">🎯</div>
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 z-10">
            Voice Interview Simulation
          </h3>
          <p className="text-neutral-400">
            Practice speaking confidently with an AI interviewer that authentically simulates real interview environments.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
