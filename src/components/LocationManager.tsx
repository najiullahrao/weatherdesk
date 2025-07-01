"use client";
import { useState, useEffect } from "react";
import Loader from "./Loader";

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
    fetch("/api/locations")
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
    await fetch(`/api/locations/${id}`, { method: "DELETE" });
    setLocations(locations.filter((loc) => loc.id !== id));
    setLoading(false);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Enter city"
        />
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Enter country"
        />
        <button onClick={addLocation} className="bg-blue-600 text-white px-4 rounded">
          Add
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <Loader />
      ) : (
        <ul className="space-y-2">
          {locations.map((loc) => (
            <li key={loc.id} className="flex justify-between items-center bg-white p-2 shadow">
              <span>{loc.city}, {loc.country}</span>
              <button
                onClick={() => deleteLocation(loc.id)}
                className="text-red-500 hover:underline"
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
