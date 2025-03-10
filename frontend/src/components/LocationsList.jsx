import { useState, useEffect } from "react";

const LocationsList = () => {
  const [locations, setLocations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [context, setContext] = useState(null);

  useEffect(() => {
    // Fetch locations from localStorage
    const storedData = JSON.parse(localStorage.getItem("data")) || [];
    setLocations(storedData);
  }, []);

  const handleLocationClick = (index, location) => {
    setSelectedIndex(index);
    setContext(location.context); // Update context without displaying it
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Locations</h2>
      {locations.length === 0 ? (
        <p className="text-gray-500">No locations found</p>
      ) : (
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location, index) => (
            <li
              key={index}
              className="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-900 transition-all duration-300"
              onClick={() => handleLocationClick(index, location)}
            >
              <h3
                className={`text-lg font-semibold transition-colors ${
                  selectedIndex === index ? "text-green-600" : "text-white-800"
                }`}
              >
                Location {index + 1}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {location.images && location.images.slice(0, 5).map((image, imgIndex) => (
                  <div key={imgIndex} className="w-20 h-20 overflow-hidden rounded-md">
                    <img
                      src={image}
                      alt={`Location ${index + 1} Image ${imgIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationsList;