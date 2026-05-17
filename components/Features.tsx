import React from "react";
import Link from "next/link";

const Features = () => {
  return (
    <section className="flex flex-col gap-14 px-2">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-4">
        <div
          className="px-4 py-1.5 rounded-full text-sm font-medium"
          style={{
            background: "rgba(99,102,241,0.08)",
            border: "0.5px solid rgba(99,102,241,0.2)",
            color: "#a5b4fc",
          }}
        >
          Everything you need
        </div>
        <h2
          className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
          style={{ color: "#f1f5f9" }}
        >
          Stop winging it.{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1, #a5b4fc)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              display: "inline",
            }}
          >
            Start winning.
          </span>
        </h2>
        <p
          className="text-base max-w-lg leading-relaxed"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          PrepWise gives you a realistic AI-powered interview environment so
          you show up confident, prepared, and ready to impress.
        </p>
      </div>

      {/* Grid */}
      <div className="flex flex-col" style={{ gap: "1rem" }}>

        {/* Row 1: Hero card full width */}
        <div
          className="group relative rounded-3xl p-10 overflow-hidden transition-all duration-500 hover:-translate-y-1 flex flex-col md:flex-row md:items-start"
          style={{
            gap: "2.5rem",
            background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.03) 100%)",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* Glow orb */}
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none group-hover:opacity-30 transition-opacity duration-500"
            style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
          />

          {/* Left content */}
          <div className="relative z-10 flex flex-col flex-1" style={{ gap: "1.5rem", minWidth: 0 }}>
            <div
              className="text-5xl inline-flex p-4 rounded-2xl w-fit"
              style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}
            >
              🤖
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: "#f1f5f9" }}>
                AI Voice Interviews
              </h3>
              <p className="text-base leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.5)" }}>
                Have a real conversation with an AI interviewer that listens, adapts, and asks
                intelligent follow-up questions — no scripts, no shortcuts, just realistic practice.
              </p>
            </div>
            <div className="flex items-center" style={{ gap: "1rem" }}>
              <Link href="/interview">
                <button
                  className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-85 hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 25px rgba(99,102,241,0.3)" }}
                >
                  Start Interview →
                </button>
              </Link>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Live voice AI</span>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div
            className="relative z-10 flex-shrink-0 rounded-2xl p-6 hidden md:flex flex-col"
            style={{ gap: "0.75rem", width: "288px", minWidth: "288px", background: "rgba(0,0,0,0.25)", border: "0.5px solid rgba(99,102,241,0.15)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>
              Sample interview
            </p>
            {[
              { role: "AI", msg: "Tell me about a challenging project you've worked on." },
              { role: "You", msg: "I built a real-time dashboard with Next.js and WebSockets..." },
              { role: "AI", msg: "How did you handle performance at scale?" },
            ].map(({ role, msg }, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${role === "You" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
                  style={{
                    background: role === "AI" ? "rgba(99,102,241,0.3)" : "rgba(16,185,129,0.3)",
                    color: role === "AI" ? "#a5b4fc" : "#6ee7b7",
                  }}
                >
                  {role === "AI" ? "AI" : "U"}
                </div>
                <p
                  className="text-xs leading-relaxed rounded-xl px-3 py-2 max-w-[85%]"
                  style={{
                    background: role === "AI" ? "rgba(99,102,241,0.08)" : "rgba(16,185,129,0.08)",
                    color: "rgba(255,255,255,0.6)",
                    border: `0.5px solid ${role === "AI" ? "rgba(99,102,241,0.15)" : "rgba(16,185,129,0.15)"}`,
                  }}
                >
                  {msg}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom glow line */}
          <div
            className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-700 rounded-full"
            style={{ background: "linear-gradient(to right, #6366f1, transparent)" }}
          />
        </div>

        {/* Row 2: Two equal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1rem" }}>

          {/* Resume card */}
          <div
            className="group relative rounded-3xl p-9 overflow-hidden transition-all duration-500 hover:-translate-y-1 flex flex-col"
            style={{
              gap: "1.5rem",
              background: "linear-gradient(135deg, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0.02) 100%)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <div
              className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none group-hover:opacity-25 transition-opacity duration-500"
              style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }}
            />
            <div className="relative z-10">
              <div
                className="text-4xl mb-6 inline-flex p-4 rounded-2xl"
                style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.2)" }}
              >
                📄
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#f1f5f9" }}>
                Resume-Based Questions
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Upload your PDF resume. We extract your skills, projects, and
                experience to generate laser-focused questions tailored just for you.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap" style={{ gap: "0.5rem", paddingTop: "0.5rem" }}>
              {["Skills", "Projects", "Experience", "Tech Stack"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(139,92,246,0.1)",
                    border: "0.5px solid rgba(139,92,246,0.25)",
                    color: "#c4b5fd",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div
              className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-700 rounded-full"
              style={{ background: "linear-gradient(to right, #8b5cf6, transparent)" }}
            />
          </div>

          {/* Instant Feedback card */}
          <div
            className="group relative rounded-3xl p-9 overflow-hidden transition-all duration-500 hover:-translate-y-1 flex flex-col"
            style={{
              gap: "1.5rem",
              background: "linear-gradient(135deg, rgba(6,182,212,0.10) 0%, rgba(6,182,212,0.02) 100%)",
              border: "1px solid rgba(6,182,212,0.2)",
            }}
          >
            <div
              className="absolute -top-10 -left-10 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none group-hover:opacity-25 transition-opacity duration-500"
              style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }}
            />
            <div className="relative z-10">
              <div
                className="text-4xl mb-6 inline-flex p-4 rounded-2xl"
                style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.2)" }}
              >
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#f1f5f9" }}>
                Instant AI Feedback
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Get detailed scores across 5 key dimensions right after every session.
                See exactly what to improve.
              </p>
            </div>
            {/* Score bars */}
            <div className="relative z-10 flex flex-col" style={{ gap: "0.75rem", paddingTop: "0.5rem" }}>
              {[
                { label: "Communication", pct: 88 },
                { label: "Technical", pct: 74 },
                { label: "Confidence", pct: 91 },
              ].map(({ label, pct }) => (
                <div key={label} className="flex items-center" style={{ gap: "0.75rem" }}>
                  <span className="text-xs w-28 shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {label}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: "linear-gradient(to right, #06b6d4, #6366f1)" }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-6 text-right" style={{ color: "#06b6d4" }}>
                    {pct}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-700 rounded-full"
              style={{ background: "linear-gradient(to right, #06b6d4, transparent)" }}
            />
          </div>
        </div>

        {/* Row 3: Two equal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1rem" }}>

          {/* Role-specific prep */}
          <div
            className="group relative rounded-3xl p-9 overflow-hidden transition-all duration-500 hover:-translate-y-1 flex flex-col"
            style={{
              gap: "1.5rem",
              background: "linear-gradient(135deg, rgba(16,185,129,0.10) 0%, rgba(16,185,129,0.02) 100%)",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
          >
            <div
              className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none group-hover:opacity-25 transition-opacity duration-500"
              style={{ background: "radial-gradient(circle, #10b981, transparent)" }}
            />
            <div className="relative z-10">
              <div
                className="text-4xl mb-6 inline-flex p-4 rounded-2xl"
                style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.2)" }}
              >
                🎯
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#f1f5f9" }}>
                Role-Specific Prep
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Choose your role, level, and tech stack. Get questions that mirror what
                top companies actually ask in real interviews.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap" style={{ gap: "0.5rem", paddingTop: "0.5rem" }}>
              {["Frontend", "Backend", "Full Stack", "SDE-1", "Senior"].map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 rounded-lg text-xs font-medium"
                  style={{
                    background: "rgba(16,185,129,0.08)",
                    border: "0.5px solid rgba(16,185,129,0.2)",
                    color: "#6ee7b7",
                  }}
                >
                  {role}
                </span>
              ))}
            </div>
            <div
              className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-700 rounded-full"
              style={{ background: "linear-gradient(to right, #10b981, transparent)" }}
            />
          </div>

          {/* Progress tracking */}
          <div
            className="group relative rounded-3xl p-9 overflow-hidden transition-all duration-500 hover:-translate-y-1 flex flex-col"
            style={{
              gap: "1.5rem",
              background: "linear-gradient(135deg, rgba(245,158,11,0.10) 0%, rgba(245,158,11,0.02) 100%)",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            <div
              className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none group-hover:opacity-25 transition-opacity duration-500"
              style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
            />
            <div className="relative z-10">
              <div
                className="text-4xl mb-6 inline-flex p-4 rounded-2xl"
                style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                📊
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#f1f5f9" }}>
                Track Your Progress
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Watch your scores climb with each interview. See exactly where you're improving
                and what still needs work.
              </p>
            </div>
            {/* Stat blocks */}
            <div className="relative z-10 grid grid-cols-3" style={{ gap: "0.75rem", paddingTop: "0.5rem" }}>
              {[
                { value: "5×", label: "Score categories" },
                { value: "∞", label: "Free interviews" },
                { value: "AI", label: "Powered feedback" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-xl p-4 text-center"
                  style={{ background: "rgba(245,158,11,0.07)", border: "0.5px solid rgba(245,158,11,0.15)" }}
                >
                  <div className="text-xl font-bold" style={{ color: "#fbbf24" }}>{value}</div>
                  <div className="text-xs mt-1 leading-tight" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</div>
                </div>
              ))}
            </div>
            <div
              className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-700 rounded-full"
              style={{ background: "linear-gradient(to right, #f59e0b, transparent)" }}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;