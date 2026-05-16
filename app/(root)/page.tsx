import Link from "next/link";

import { Button } from "@/components/ui/button";
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
    getInterviewsByUserId(userId),
    getLatestInterviews({ userId }),
  ]);

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const hasUpcomingInterviews = (allInterview?.length ?? 0) > 0;

  return (
    <>
      <section className="flex flex-col items-center text-center gap-8 py-24 px-4 mt-8 relative">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none"></div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-neutral-500 leading-tight pb-2 z-10">
          Practice AI-Powered Mock Interviews
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed z-10">
          Prepare for technical interviews using personalized AI-generated questions and advanced voice-based interview simulations.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mt-8 w-full sm:w-auto z-10">
          <Button asChild className="btn-primary max-sm:w-full text-md py-6 px-10 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.06)] hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all hover:-translate-y-0.5">
            <Link href="/interview">Start AI Interview</Link>
          </Button>
          <Button asChild variant="outline" className="max-sm:w-full text-md py-6 px-10 rounded-full bg-neutral-950/50 border-neutral-700 hover:bg-neutral-800 hover:border-neutral-500 text-white transition-all hover:-translate-y-0.5 backdrop-blur-sm">
            <Link href="/interview?mode=resume">Resume-Based Interview</Link>
          </Button>
        </div>
      </section>

      <Features />

      <Testimonials />

      <section className="flex flex-col gap-6 mt-16">
        <h2>Your Interviews</h2>

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
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Interviews</h2>

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
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
