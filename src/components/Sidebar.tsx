"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, MapPin, User, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
//   { href: "/locations", label: "Locations", icon: MapPin },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    // Remove user data from localStorage if present
    localStorage.removeItem("user"); // Change "user" to your actual key if needed
    signOut({ callbackUrl: "/" });
  };

  return (
    <aside
      className={`h-screen ${collapsed ? "w-20" : "w-64"} bg-gradient-to-b from-blue-800 to-blue-600 text-white flex flex-col shadow-lg transition-all duration-300`}
    >
      {/* Toggle Arrow */}
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-end"} px-2 pt-4 pb-2`}>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-2 rounded-full hover:bg-blue-700/60 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
      {/* App Name */}
      {!collapsed && (
        <div className="flex items-center gap-2 px-6 py-6 border-b border-blue-700">
          <span className="text-2xl font-bold tracking-tight">WeatherDesk</span>
        </div>
      )}
      <nav className={`flex-1 ${collapsed ? "px-2" : "px-4"} py-6 space-y-2`}>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} px-4 py-2 rounded-lg transition-colors font-medium text-base hover:bg-blue-700/60 ${
              mounted && pathname === href ? "bg-blue-700/80" : ""
            }`}
          >
            <Icon className="w-5 h-5" />
            {!collapsed && label}
          </Link>
        ))}
      </nav>
      <div className={`pb-6 ${collapsed ? "px-2" : "px-4"}`}>
        <button
          onClick={handleSignOut}
          className={`flex items-center ${collapsed ? "justify-center" : "gap-2"} w-full px-4 py-2 rounded-lg bg-blue-700/80 hover:bg-blue-800 transition-colors font-medium`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </aside>
  );
} 