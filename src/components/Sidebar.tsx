"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, MapPin, User, LogOut, ChevronLeft, ChevronRight, CloudSun } from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/locations", label: "Locations", icon: MapPin },
  { href: "/dashboard/weather", label: "Weather", icon: CloudSun },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    localStorage.removeItem("user");
    await signOut({ callbackUrl: "/" });
    // No need to setSigningOut(false) because redirect will happen
  };

  return (
    <aside
      className={`hidden md:flex sticky top-0 h-screen ${collapsed ? "w-16" : "w-60"} bg-gradient-to-b from-blue-200 via-blue-100 to-blue-50 border-r border-blue-100 text-blue-900 flex-col shadow-xl transition-all duration-300 z-20`}
    >
      {/* App Name + Toggle Arrow */}
      {!collapsed ? (
        <div className="flex items-center justify-between px-4 py-6 border-b border-blue-100">
          <div className="flex items-center gap-2">
            <CloudSun className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-extrabold tracking-tight text-blue-700">WeatherDesk</span>
          </div>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-2 rounded-full hover:bg-blue-100 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center pt-4 pb-2 border-b border-blue-100">
          <CloudSun className="w-8 h-8 text-blue-500 mb-2" />
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-2 rounded-full hover:bg-blue-100 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
      <nav className={`flex-1 ${collapsed ? "px-2" : "px-4"} py-6 space-y-3`}> 
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = mounted && pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center ${collapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-xl transition-all font-medium text-base
                ${isActive ? "bg-white shadow-lg text-blue-700 font-bold" : "hover:bg-blue-100 hover:text-blue-700"}
                group
              `}
              style={{ boxShadow: isActive ? "0 4px 24px 0 rgba(59,130,246,0.08)" : undefined }}
            >
              {/* Blue accent bar for active nav item */}
              {isActive && !collapsed && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-blue-500" />
              )}
              <Icon className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-blue-400 group-hover:text-blue-600"}`} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className={`pb-6 ${collapsed ? "px-2" : "px-4"}`}>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className={`flex items-center ${collapsed ? "justify-center" : "gap-2"} w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-blue-700 transition-all
            ${signingOut ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {signingOut ? (
            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
          ) : (
            <LogOut className="w-5 h-5" />
          )}
          {!collapsed && (signingOut ? "Signing out..." : "Sign out")}
        </button>
      </div>
    </aside>
  );
} 