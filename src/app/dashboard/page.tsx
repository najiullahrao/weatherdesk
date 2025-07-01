import LocationManager from "@/components/LocationManager";

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Locations</h2>
      <LocationManager />
    </div>
  );
}
