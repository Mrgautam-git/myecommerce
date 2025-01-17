import React, { createContext, useState, useContext } from 'react';

// Create a Context for the user
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  // You can fetch the userId from localStorage, session, or other means
  React.useEffect(() => {
    const storedUserId = localStorage.getItem('userId'); // Example
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access userId in any component
export const useUser = () => {
  return useContext(UserContext);
};
