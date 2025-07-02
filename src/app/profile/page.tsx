"use client";
import Profile from "@/components/Profile";
import Sidebar from "@/components/Sidebar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center border border-blue-100">
          <Profile />
        </div>
      </main>
    </div>
  );
} 