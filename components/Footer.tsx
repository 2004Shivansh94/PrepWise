import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t border-neutral-800/60 pt-16 pb-8 relative overflow-hidden">
      {/* Top glowing line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative z-10">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-white">PrepWise</h3>
          <p className="text-neutral-400">
            AI-powered interview practice platform.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-white">Product</h4>
          <Link href="/interview" className="text-neutral-400 hover:text-white transition-colors w-fit">
            AI Interviews
          </Link>
          <Link href="/interview" className="text-neutral-400 hover:text-white transition-colors w-fit">
            Resume Interviews
          </Link>
          <Link href="/interview" className="text-neutral-400 hover:text-white transition-colors w-fit">
            Interview Feedback
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-white">Resources</h4>
          <Link href="#" className="text-neutral-400 hover:text-white transition-colors w-fit">
            About
          </Link>
          <Link href="#" className="text-neutral-400 hover:text-white transition-colors w-fit">
            Privacy Policy
          </Link>
          <Link href="#" className="text-neutral-400 hover:text-white transition-colors w-fit">
            Contact
          </Link>
        </div>
      </div>

      <div className="text-center text-neutral-500 pt-8 border-t border-neutral-800/50">
        <p>&copy; {currentYear} PrepWise. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
