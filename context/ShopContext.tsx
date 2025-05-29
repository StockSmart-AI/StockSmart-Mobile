import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { AuthContext } from "./AuthContext"; // Assuming AuthContext provides user info
import { getShopsByOwner, createShop as apiCreateShop } from "../api/shop"; // Renamed to avoid conflict

export interface Shop {
  id: string;
  name: string;
  address?: string; // Address is optional for now, adjust if always present
}

interface ShopContextType {
  shops: Shop[];
  currentShop: Shop | null;
  switchShop: (shopId: string) => void;
  addShop: (name: string, address: string) => Promise<Shop | null>; // Updated to include address and return promise
  isLoading: boolean;
  fetchShops: () => Promise<void>; // Added function to manually refresh shops
}

export const ShopContext = createContext<ShopContextType | undefined>(
  undefined
);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const token = authContext?.token;

  const [shops, setShops] = useState<Shop[]>([]);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchShops = async () => {
    if (user && token) {
      setIsLoading(true);
      try {
        const response = await getShopsByOwner(token);
        if (response.data && Array.isArray(response.data)) {
          const fetchedShops: Shop[] = response.data;
          setShops(fetchedShops);
          if (fetchedShops.length > 0) {
            // Try to keep current shop if it still exists, otherwise set to first, or load last selected from storage
            const currentShopStillExists = fetchedShops.find(
              (s) => s.id === currentShop?.id
            );
            if (currentShopStillExists) {
              setCurrentShop(currentShopStillExists);
            } else {
              setCurrentShop(fetchedShops[0]);
            }
          } else {
            setCurrentShop(null);
          }
        } else {
          setShops([]);
          setCurrentShop(null);
        }
      } catch (error) {
        console.error("Failed to fetch shops:", error);
        setShops([]);
        setCurrentShop(null);
        // Optionally, set an error state here to display to the user
      } finally {
        setIsLoading(false);
      }
    } else {
      // No user or token, clear shops
      setShops([]);
      setCurrentShop(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [user, token]); // Re-fetch if user or token changes

  const switchShop = (shopId: string) => {
    const shopToSelect = shops.find((shop) => shop.id === shopId);
    if (shopToSelect) {
      setCurrentShop(shopToSelect);
      // console.log(`Switched to shop: ${shopToSelect.name}`);
      // TODO: Persist selected shop ID to AsyncStorage for next session
    } else {
      // console.warn(`Shop with id ${shopId} not found.`);
    }
  };

  const addShop = async (
    name: string,
    address: string
  ): Promise<Shop | null> => {
    if (!user || !token) {
      console.error("User not logged in or token missing, cannot add shop");
      throw new Error("User not authenticated");
    }
    setIsLoading(true);
    try {
      const response = await apiCreateShop(name, address, token);
      if (response.data && response.data.shop) {
        const newShop: Shop = response.data.shop;
        setShops((prevShops) => [...prevShops, newShop]);
        setCurrentShop(newShop); // Set the new shop as current
        setIsLoading(false);
        return newShop;
      }
      setIsLoading(false);
      return null;
    } catch (error) {
      console.error("Failed to add shop:", error);
      setIsLoading(false);
      // Rethrow or handle error appropriately (e.g., show a message to the user)
      throw error;
    }
  };

  return (
    <ShopContext.Provider
      value={{ shops, currentShop, switchShop, addShop, isLoading, fetchShops }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
