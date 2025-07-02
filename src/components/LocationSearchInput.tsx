import React, { useRef } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

interface LocationSearchInputProps {
  onSelectLocation: (location: { city: string; country: string }) => void;
}

const libraries: ("places")[] = ["places"];

export default function LocationSearchInput({ onSelectLocation }: LocationSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.address_components) return;
    let city = "";
    let country = "";
    for (const comp of place.address_components) {
      if (comp.types.includes("locality")) city = comp.long_name;
      if (comp.types.includes("country")) country = comp.long_name;
    }
    if (city && country) {
      onSelectLocation({ city, country });
      if (inputRef.current) inputRef.current.value = `${city}, ${country}`;
    }
  };

  if (!isLoaded) {
    return <input className="border p-2 rounded w-full" placeholder="Loading..." disabled />;
  }

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <input
        ref={inputRef}
        className="border p-2 rounded w-full"
        placeholder="Search city or place"
        type="text"
      />
    </Autocomplete>
  );
} 