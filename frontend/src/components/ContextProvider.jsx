import { createContext, useState, useContext } from "react";

// Create Context
const LocationContext = createContext();

// Provider Component
export const LocationProvider = ({ children }) => {
  const [context, setContext] = useState(null);

  return (
    <LocationContext.Provider value={{ context, setContext }}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom Hook to use context
export const useLocationContext = () => useContext(LocationContext);
