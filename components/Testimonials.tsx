import React from "react";

const testimonials = [
  {
    name: "Aman Sharma",
    role: "Frontend Developer",
    text: "PrepWise helped me practice real interview questions and boosted my confidence before placements.",
  },
  {
    name: "Neha Verma",
    role: "Software Engineer",
    text: "The AI interviewer feels like a real interview. Super helpful for preparing technical answers.",
  },
  {
    name: "Rohit Singh",
    role: "CS Student",
    text: "The resume-based interview feature is amazing. It asks questions directly from my projects.",
  },
];

const Testimonials = () => {
  return (
    <section className="flex flex-col gap-6 mt-16">
      <h2 className="text-3xl font-bold text-center">Loved by Students & Developers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex flex-col p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/50 transition-colors duration-200"
          >
            <p className="text-neutral-300 italic mb-6 flex-grow">
              "{testimonial.text}"
            </p>
            <div>
              <p className="font-semibold text-white">{testimonial.name}</p>
              <p className="text-sm text-neutral-400">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
