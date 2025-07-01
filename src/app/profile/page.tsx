"use client";
import Profile from "@/components/Profile";
import Sidebar from "@/components/Sidebar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
          <Profile />
        </div>
      </main>
    </div>
  );
} 