import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for managing location
const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({ lat: 49.28204, lng: -123.1171})

  // Load location from localStorage on mount
  useEffect(() => {
    const savedLocation = JSON.parse(localStorage.getItem('userLocation'));
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  // Save location to localStorage whenever it changes
  useEffect(() => {
    if (location) {
      localStorage.setItem('userLocation', JSON.stringify(location));
    }
  }, [location]);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
