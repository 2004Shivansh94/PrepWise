import Link from "next/link";
import InterviewCard from "@/components/InterviewCard";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();
  const userId = user?.id ?? "";

  const [userInterviews, allInterview] = await Promise.all([
    userId ? getInterviewsByUserId(userId) : Promise.resolve(null),
    userId ? getLatestInterviews({ userId }) : Promise.resolve(null),
  ]);

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const hasUpcomingInterviews = (allInterview?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-16">
      {/* Hero */}
      <section className="relative flex flex-col items-center text-center gap-6 py-20 px-4 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.20] blur-3xl pointer-events-none animate-float-slow"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.8), transparent 70%)" }}
        />
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.15] blur-3xl pointer-events-none animate-float-medium"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.8), transparent 70%)" }}
        />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.15] blur-3xl pointer-events-none animate-float-reverse"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.8), transparent 70%)" }}
        />

        {/* Badge */}
        <div className="relative flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium z-10"
          style={{
            background: "rgba(99,102,241,0.08)",
            borderColor: "rgba(99,102,241,0.25)",
            color: "#a5b4fc",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          AI Powered Interview Platform
        </div>

        {/* Headline */}
        <h1
          className="relative text-5xl md:text-6xl font-bold tracking-tight leading-tight z-10 max-w-3xl"
          style={{ color: "#f1f5f9" }}
        >
          Ace your next{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1, #a5b4fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            technical interview
          </span>
        </h1>

        <p className="relative text-lg max-w-xl leading-relaxed z-10"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Practice with a real AI voice interviewer, get detailed feedback, and
          land your dream job with confidence.
        </p>

        <div className="relative flex flex-col sm:flex-row gap-4 z-10 mt-2">
          <Link href="/interview">
            <button
              className="px-8 py-3 rounded-full font-semibold text-white text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 0 30px rgba(99,102,241,0.3)",
              }}
            >
              Start AI Interview
            </button>
          </Link>
          <Link href="/interview?mode=resume">
            <button
              className="px-8 py-3 rounded-full font-medium text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Upload Resume
            </button>
          </Link>
        </div>

        {/* Stats row */}
        <div
          className="relative flex items-center gap-8 mt-4 z-10 flex-wrap justify-center"
          style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: "#4ade80" }}>✓</span> Free to start
          </div>
          <div className="hidden sm:block w-px h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
          <div className="flex items-center gap-2">
            <span style={{ color: "#4ade80" }}>✓</span> AI voice interviewer
          </div>
          <div className="hidden sm:block w-px h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
          <div className="flex items-center gap-2">
            <span style={{ color: "#4ade80" }}>✓</span> Instant feedback
          </div>
        </div>
      </section>

      {/* Features */}
      <Features />

      {/* Your Interviews */}
      <section className="flex flex-col gap-6 px-2">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: "#f1f5f9" }}
            >
              Your interviews
            </h2>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              Pick up where you left off
            </p>
          </div>
          <Link href="/interview">
            <button
              className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "0.5px solid rgba(99,102,241,0.25)",
                color: "#a5b4fc",
              }}
            >
              + New interview
            </button>
          </Link>
        </div>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                level={interview.level}
                questionsCount={interview.questions?.length}
              />
            ))
          ) : (
            <div
              className="w-full flex flex-col items-center justify-center py-16 rounded-2xl gap-3"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "0.5px dashed rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="text-4xl mb-2 p-4 rounded-2xl"
                style={{ background: "rgba(99,102,241,0.08)" }}
              >
                🎯
              </div>
              <p className="font-medium" style={{ color: "#f1f5f9" }}>
                No interviews yet
              </p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                Start your first mock interview to track your progress
              </p>
              <Link href="/interview">
                <button
                  className="mt-2 px-6 py-2.5 rounded-full text-sm font-medium text-white"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                  Start now
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Take Interviews */}
      <section className="flex flex-col gap-6 px-2">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#f1f5f9" }}>
            Explore interviews
          </h2>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Try interviews created by other users
          </p>
        </div>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                level={interview.level}
                questionsCount={interview.questions?.length}
              />
            ))
          ) : (
            <div
              className="w-full flex flex-col items-center justify-center py-16 rounded-2xl gap-3"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "0.5px dashed rgba(255,255,255,0.1)",
              }}
            >
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                No interviews available yet
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;