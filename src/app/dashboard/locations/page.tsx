"use client";
import LocationManager from "@/components/LocationManager";

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Manage Your Locations</h1>
        <LocationManager />
      </div>
    </div>
  );
} 