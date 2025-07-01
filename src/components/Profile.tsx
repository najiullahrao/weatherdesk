"use client";
import { useSession, signOut } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-blue-700 mb-2 overflow-hidden">
        {user?.image ? (
          <img src={user.image} alt="avatar" className="w-full h-full object-cover rounded-full" />
        ) : (
          user?.name?.[0] || user?.email?.[0] || "U"
        )}
      </div>
      <div className="text-center">
        <p className="text-xl font-semibold text-blue-900">{user?.name || "No Name"}</p>
        <p className="text-blue-600 text-sm">{user?.email}</p>
      </div>
      {/* <button
        onClick={() => signOut()}
        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow font-medium transition-colors"
      >
        Logout
      </button> */}
    </div>
  );
}
