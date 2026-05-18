import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser, signOut } from "@/lib/actions/auth.action";
import UserDropdown from "@/components/UserDropdown";

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const handleLogout = async () => {
    "use server";

    await signOut();
    redirect("/sign-in");
  };

  return (
    <div className="root-layout">
      <header className="flex w-full items-center justify-between gap-4">
        <nav className="app-nav">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
            <h2 className="text-primary-100">PrepWise</h2>
          </Link>
        </nav>

        <div className="nav-profile">
          <UserDropdown user={user} onLogout={handleLogout} />
        </div>
      </header>

      {children}
    </div>
  );
};

export default Layout;
