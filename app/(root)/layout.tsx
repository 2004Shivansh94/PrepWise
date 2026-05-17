import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { LogOut, UserCircle } from "lucide-react";

import { getCurrentUser, signOut } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";

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
          <div className="profile-chip">
            <UserCircle className="size-9 text-primary-200" />
            <div className="hidden sm:block">
              <p className="profile-name">{user.name}</p>
              <p className="profile-email">{user.email}</p>
            </div>
          </div>

          <form action={handleLogout}>
            <Button type="submit" className="btn-secondary flex items-center gap-2 px-3 sm:px-4">
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </form>
        </div>
      </header>

      {children}
    </div>
  );
};

export default Layout;
