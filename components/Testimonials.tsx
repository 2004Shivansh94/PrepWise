import React from "react";

const testimonials = [
  {
    name: "Aman Sharma",
    role: "Frontend Developer",
    text: "PrepWise helped me practice real interview questions and boosted my confidence.",
  },
  {
    name: "Neha Verma",
    role: "Software Engineer",
    text: "The AI interviewer feels like a real interview.",
  },
  {
    name: "Rohit Singh",
    role: "CS Student",
    text: "The resume-based interview feature asks questions directly from my projects.",
  },
];

const Testimonials = () => {
  return (
    <section className="flex flex-col gap-6 mt-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
        Loved by Students & Developers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex flex-col p-8 rounded-2xl border border-neutral-800/50 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-neutral-700 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-300 group relative overflow-hidden"
          >
            {/* Top gradient accent block on hover */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <p className="text-neutral-300 italic mb-8 flex-grow leading-relaxed z-10">
              "{testimonial.text}"
            </p>
            <div className="flex flex-col">
              <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                {testimonial.name}
              </span>
              <span className="text-sm text-neutral-500">
                {testimonial.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
