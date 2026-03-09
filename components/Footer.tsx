import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-neutral-800 pt-12 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
