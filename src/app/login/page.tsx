// 'use client';

// import { signIn, getProviders } from "next-auth/react";
// import { useState, useEffect } from "react";

// type Provider = {
//   id: string;
//   name: string;
//   type: string;
//   signinUrl: string;
//   callbackUrl: string;
// };

// export default function LoginPage() {
//   const [providers, setProviders] = useState<Record<
//     string,
//     Provider
//   > | null>(null);

//   useEffect(() => {
//     (async () => {
//       const res = await getProviders();
//       setProviders(res);
//     })();
//   }, []);

//   const googleProvider = providers?.google;

//   return (
//     // Outer container: Changed to emerald to teal gradient
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-500 to-teal-600">
//       {/* Login Card Container: Changed to slate background */}
//       <div className="p-8 bg-slate-50 rounded-xl shadow-2xl w-full max-w-sm text-center transform transition-all duration-300 hover:scale-105">
//         {/* Title: Changed to emerald color */}
//         <h1 className="text-4xl font-extrabold text-emerald-700 mb-6 tracking-tight">
//           Welcome!
//         </h1>
//         {/* Subtitle: Changed to slate color */}
//         <p className="text-slate-600 mb-8">Sign in to your account</p>

//         {googleProvider && (
//           // Button: Changed to orange with red hover
//           <button
//             onClick={() => signIn(googleProvider.id, { callbackUrl: "/dashboard" })}
//             className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 shadow-md"
//           >
//             {/* Optional Google Icon Placeholder */}
//             <span className="inline-block mr-2 align-middle">
//               {/*  */}
//             </span>
//             Sign in with {googleProvider.name}
//           </button>
//         )}
//         {!googleProvider && (
//           // Loading text: Changed to slate color
//           <p className="text-slate-500">Loading sign-in options...</p>
//         )}
//       </div>
//     </div>
//   );
// }