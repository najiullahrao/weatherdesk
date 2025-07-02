"use client";
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();
  const user = session?.user;
  // These fields may not be present in the session, so fallback to 'N/A'
  const fields = [
    { label: "User ID", value: user?.id || "N/A" },
    { label: "Name", value: user?.name || "N/A" },
    { label: "Email", value: user?.email || "N/A" },
    { label: "Email Verified", value: user?.emailVerified ? String(user.emailVerified) : "N/A" },
    { label: "Subscription Status", value: user?.subscriptionStatus || "N/A" },
    { label: "Extra Auth (Google)", value: user?.isExtraAuth !== undefined ? (user.isExtraAuth ? "Yes" : "No") : "N/A" },
  ];
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-24 h-24 rounded-full border-4 border-blue-200 flex items-center justify-center text-3xl font-bold text-blue-700 mb-2 overflow-hidden bg-blue-50">
        {user?.image ? (
          <img src={user.image} alt="avatar" className="w-full h-full object-cover rounded-full" />
        ) : (
          user?.name?.[0] || user?.email?.[0] || "U"
        )}
      </div>
      <div className="w-full max-w-xs bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-blue-100">
        {fields.map((f) => (
          <div key={f.label} className="flex justify-between items-center py-2 border-b last:border-b-0 border-blue-50">
            <span className="text-blue-900 font-medium text-sm">{f.label}</span>
            <span className="text-blue-700 text-sm text-right break-all">{f.value}</span>
          </div>
        ))}
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
