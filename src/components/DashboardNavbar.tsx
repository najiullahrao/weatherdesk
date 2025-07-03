"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function DashboardNavbar() {
  const { data: session } = useSession();
  const username = session?.user?.name || session?.user?.email || "User";
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-blue-100 shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <button
          className="md:hidden p-2 rounded hover:bg-blue-50 focus:outline-none"
          onClick={() => setOpen((o) => !o)}
          aria-label="Open sidebar menu"
        >
          <Menu className="w-6 h-6 text-blue-700" />
        </button>
        <span className="text-xl font-bold text-blue-700 tracking-tight hidden md:inline">Welcome Back, {username}</span>
      </div>
      <div className="flex-1 flex justify-end">
        <span className="text-blue-800 font-semibold text-base md:text-lg">Dashboard</span>
      </div>
    </nav>
  );
} 