"use client";
import { useState } from "react";
import Loader from "@/components/Loader";

const PREMIUM_PRICE_ID = "price_1RgkCJAUW58rKR8DgMxzQw74"; // TODO: Replace with your real Stripe priceId

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({ priceId: PREMIUM_PRICE_ID }),
      headers: { "Content-Type": "application/json" },
    });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Free</h2>
          <p className="text-4xl font-extrabold text-blue-700 mb-4">$0<span className="text-base font-normal">/mo</span></p>
          <ul className="text-blue-900 mb-6 space-y-2 text-center">
            <li>Basic weather dashboard</li>
            <li>Save locations</li>
            <li>5-day forecast</li>
          </ul>
          <button className="bg-blue-100 text-blue-700 px-6 py-2 rounded-lg font-semibold cursor-not-allowed opacity-60 w-full">Current Plan</button>
        </div>
        {/* Premium Plan */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-400 flex flex-col items-center relative">
          <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-bold">Premium</span>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Premium</h2>
          <p className="text-4xl font-extrabold text-blue-700 mb-4">$9.99<span className="text-base font-normal">/mo</span></p>
          <ul className="text-blue-900 mb-6 space-y-2 text-center">
            <li>All Free features</li>
            <li>Weather alerts</li>
            <li>Extended 10+ day forecasts</li>
            <li>Historical weather data</li>
            <li>Priority support</li>
          </ul>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className={`bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold w-full shadow hover:from-blue-600 hover:to-blue-800 transition-all ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? <span className="flex items-center justify-center"><Loader /> Subscribing...</span> : "Subscribe"}
          </button>
        </div>
      </div>
      <div className="absolute bottom-8 left-0 right-0 text-center text-blue-500 text-sm">
        <span>Premium unlocks weather alerts, extended forecasts, and historical data.</span>
      </div>
    </div>
  );
} 