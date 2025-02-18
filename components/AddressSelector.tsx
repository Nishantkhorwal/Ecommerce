"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import Leaflet for type safety

const defaultCenter: [number, number] = [28.6139, 77.209]; // Set initial coordinates

const AddressSelector = ({ address, setAddress }: { address: string; setAddress: (val: string) => void }) => {
  const [position, setPosition] = useState<[number, number]>(defaultCenter); // Initial position
  const [isMapVisible, setIsMapVisible] = useState(false); // Track if map is visible
  const [searchResults, setSearchResults] = useState<any[]>([]); // Autocomplete search results
  const [query, setQuery] = useState(''); // Query to search addresses

  // Fetch address based on coordinates
  const fetchAddress = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (data.display_name) setAddress(data.display_name);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Fetch address suggestions from Nominatim API, filter by country (India)
  const fetchAddressSuggestions = async (query: string) => {
    if (query) {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=in&accept-language=en`
      );
      const data = await res.json();
      setSearchResults(data);
    } else {
      setSearchResults([]);
    }
  };

  // Location marker component
  function LocationMarker() {
    useMapEvents({
      click(e: L.LeafletMouseEvent) {
        const { lat, lng } = e.latlng; // Extract lat and lng from LatLng object
        setPosition([lat, lng]); // Set position as [number, number]
        fetchAddress(lat, lng); // Fetch address based on lat and lng
        setIsMapVisible(false); // Close map after marker placement
      },
    });

    return position ? <Marker position={position} /> : null;
  }

  // Handle Search Input Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value); // Update the query
    setAddress(value); // Update address with input
    fetchAddressSuggestions(value); // Fetch autocomplete results
  };

  // Handle Search Result Selection
  const handleSelectSearchResult = (result: any) => {
    setPosition([parseFloat(result.lat), parseFloat(result.lon)]); // Set position to selected result's coordinates
    setAddress(result.display_name); // Set selected address to input
    setSearchResults([]); // Clear search results
    setQuery(result.display_name); // Update query with selected address
  };

  // Show map only when button is clicked
  const handleShowMap = () => {
    setIsMapVisible(true);
  };

  // Handle Current Location button
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        fetchAddress(latitude, longitude);
        setIsMapVisible(false); // Close map after setting current location
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Update map view based on address query
  const MapViewUpdater = () => {
    const map = useMap();
    if (position) {
      map.setView(position); // Update map center to the position
    }
    return null;
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold">Select Address</label>
      <input
        type="text"
        className="w-full border rounded-md p-2"
        placeholder="Enter address"
        value={query} // Bind the value to the query
        onChange={handleSearchChange} // Update address with input
      />

      {/* Show search results when available */}
      {searchResults.length > 0 && (
        <div className="bg-white border mt-2 rounded-md shadow-lg">
          {searchResults.map((result) => (
            <div
              key={result.place_id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelectSearchResult(result)}
            >
              {result.display_name}
            </div>
          ))}
        </div>
      )}

      {/* Button to trigger map visibility */}
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        onClick={handleShowMap}
      >
        Select Address on Map
      </button>

      {/* Current Location Button */}
      <button
        className="mt-2 ml-2 px-4 py-2 bg-green-500 text-white rounded-lg"
        onClick={handleCurrentLocation}
      >
        Use Current Location
      </button>

      {/* Map visibility in a modal-like container */}
      {isMapVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="relative bg-white rounded-lg shadow-lg p-4 w-11/12 md:w-3/4 lg:w-1/2">
            <MapContainer center={defaultCenter} zoom={13} style={{ height: "400px", width: "95%" }} className="mt-2">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
              <MapViewUpdater /> {/* Update map view based on position */}
            </MapContainer>
            <button
              className="absolute z-50 top-2 right-2 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
              onClick={() => setIsMapVisible(false)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;






