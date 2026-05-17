import React from "react";

const testimonials = [
  {
    name: "Aman Sharma",
    role: "Frontend Developer",
    company: "Hired at Razorpay",
    initials: "AS",
    color: "#6366f1",
    rating: 5,
    text: "PrepWise completely changed how I prepare for interviews. The AI interviewer felt surprisingly real and the feedback was brutally honest — exactly what I needed.",
  },
  {
    name: "Neha Verma",
    role: "Software Engineer",
    company: "Hired at Swiggy",
    initials: "NV",
    color: "#8b5cf6",
    rating: 5,
    text: "The AI interviewer asks follow-up questions just like a real interviewer would. I went into my actual interview feeling way more confident.",
  },
  {
    name: "Rohit Singh",
    role: "CS Student",
    company: "Placed at TCS",
    initials: "RS",
    color: "#06b6d4",
    rating: 5,
    text: "The resume-based interview feature is incredible. It asked questions directly from my projects and gave me feedback I could act on immediately.",
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} style={{ color: "#fbbf24", fontSize: "13px" }}>★</span>
    ))}
  </div>
);

const Testimonials = () => {
  return (
    <section className="flex flex-col gap-8 px-2">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className="px-4 py-1.5 rounded-full text-sm font-medium"
          style={{
            background: "rgba(99,102,241,0.08)",
            border: "0.5px solid rgba(99,102,241,0.2)",
            color: "#a5b4fc",
          }}
        >
          Success stories
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold tracking-tight"
          style={{ color: "#f1f5f9" }}
        >
          Loved by developers
        </h2>
        <p
          className="text-base max-w-md leading-relaxed"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Join thousands of developers who used PrepWise to land their dream jobs.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="group relative flex flex-col gap-4 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "0.5px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Glow on hover */}
            <div
              className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 blur-2xl pointer-events-none transition-opacity duration-300"
              style={{ background: t.color }}
            />

            {/* Stars */}
            <Stars count={t.rating} />

            {/* Quote */}
            <p
              className="text-sm leading-relaxed flex-grow"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Divider */}
            <div
              className="w-full h-px"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />

            {/* Author */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: `${t.color}20`,
                  border: `0.5px solid ${t.color}40`,
                  color: t.color,
                }}
              >
                {t.initials}
              </div>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#f1f5f9" }}
                >
                  {t.name}
                </p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {t.role} · {t.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;