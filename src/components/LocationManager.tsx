"use client";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import LocationSearchInput from "./LocationSearchInput";

type Location = {
  id: string;
  city: string;
  country: string;
};

export default function LocationManager() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/locations", { credentials: "include" })
      .then((res) => res.json())
      .then(setLocations)
      .finally(() => setLoading(false));
  }, []);

  const addLocation = async () => {
    setError("");
    if (!city || !country) {
      setError("City and country are required");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/locations", {
      method: "POST",
      body: JSON.stringify({ city, country }),
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to add location");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setLocations([...locations, data]);
    setCity("");
    setCountry("");
    setLoading(false);
  };

  const deleteLocation = async (id: string) => {
    setLoading(true);
    await fetch(`/api/locations/${id}`, { method: "DELETE", credentials: "include" });
    setLocations(locations.filter((loc) => loc.id !== id));
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
      <div className="flex flex-col sm:flex-row gap-2 mb-4 items-center">
        <div className="flex-1 w-full">
          <LocationSearchInput
            onSelectLocation={({ city, country }: { city: string; country: string }) => {
              setCity(city);
              setCountry(country);
            }}
          />
        </div>
        <button onClick={addLocation} className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition-all h-10 min-w-[80px]">Add</button>
      </div>
      {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
      {loading ? (
        <Loader />
      ) : (
        <ul className="space-y-2">
          {locations.map((loc) => (
            <li key={loc.id} className="flex justify-between items-center bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100">
              <span className="text-blue-900 font-medium">{loc.city}, {loc.country}</span>
              <button
                onClick={() => deleteLocation(loc.id)}
                className="text-red-500 hover:underline font-semibold"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
