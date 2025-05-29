import React, { createContext, useContext, useState, ReactNode } from "react";

// Define an interface for an employee
export interface Employee {
  name: string;
  email: string;
}

// Default shop details
const defaultShopDetails = {
  shopName: "",
  street: "",
  building: "",
  unit: "",
  employees: [] as Employee[], // Updated to store Employee objects
  permissions: {} as Record<string, boolean>, // Explicitly type permissions
};

// Create the context with the default value
const ShopCreationContext = createContext({
  shopDetails: defaultShopDetails,
  setShopDetails: (shopDetails: typeof defaultShopDetails) => {}, // Empty function by default
});

// The provider component
export const ShopCreationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [shopDetails, setShopDetails] = useState(defaultShopDetails);

  return (
    <ShopCreationContext.Provider value={{ shopDetails, setShopDetails }}>
      {children}
    </ShopCreationContext.Provider>
  );
};

// Custom hook to use the context
export const useShopCreation = () => useContext(ShopCreationContext);
