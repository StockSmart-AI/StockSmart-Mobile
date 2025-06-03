import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  pricePerUnit: number;
  isSerialized: boolean;
  barcodes: string[];
  img: any;
  stockQuantity: number;
}

interface Notification {
  message: string;
  type: 'error' | 'success' | 'info';
}

interface CartContextType {
  items: CartItem[];
  isSubmitting: boolean;
  notification: Notification | null;
  addItem: (product: any) => void;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  removeBarcode: (itemId: string, barcode: string) => void;
  clearCart: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setNotification: (notification: Notification | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const addItem = (scannedProduct: any) => {
    setItems(prevItems => {
      if (scannedProduct.isSerialized) {
        const scannedBarcode = scannedProduct.scannedBarcode;
        const existingItemWithBarcode = prevItems.find(item => 
          item.id === scannedProduct.id && 
          item.barcodes.includes(scannedBarcode)
        );

        if (existingItemWithBarcode) {
          setNotification({
            message: "This barcode has already been scanned",
            type: "error"
          });
          return prevItems;
        }

        const existingProductIndex = prevItems.findIndex(item => 
          item.id === scannedProduct.id && 
          item.isSerialized
        );

        if (existingProductIndex > -1) {
          const existingItem = prevItems[existingProductIndex];
          const updatedBarcodes = [...existingItem.barcodes, scannedBarcode];
          const updatedItem = { 
            ...existingItem, 
            barcodes: updatedBarcodes, 
            quantity: updatedBarcodes.length 
          };
          const updatedItems = [...prevItems];
          updatedItems[existingProductIndex] = updatedItem;
          setNotification({
            message: `${scannedProduct.name} added to cart`,
            type: "success"
          });
          return updatedItems;
        } else {
          const newItem: CartItem = {
            id: scannedProduct.id,
            name: scannedProduct.name,
            category: scannedProduct.category,
            quantity: 1,
            pricePerUnit: scannedProduct.price,
            isSerialized: true,
            barcodes: [scannedBarcode],
            img: { uri: scannedProduct.image_url },
            stockQuantity: scannedProduct.quantity
          };
          setNotification({
            message: `${scannedProduct.name} added to cart`,
            type: "success"
          });
          return [...prevItems, newItem];
        }
      } else {
        const existingItemIndex = prevItems.findIndex(item => item.id === scannedProduct.id);
        if (existingItemIndex > -1) {
          const existingItem = prevItems[existingItemIndex];
          if (existingItem.quantity >= scannedProduct.quantity) {
            setNotification({
              message: `Cannot add more ${scannedProduct.name}. Only ${scannedProduct.quantity} items in stock.`,
              type: "error"
            });
            return prevItems;
          }
          const updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = updatedItem;
          setNotification({
            message: `${scannedProduct.name} quantity increased`,
            type: "success"
          });
          return updatedItems;
        } else {
          const newItem: CartItem = {
            id: scannedProduct.id,
            name: scannedProduct.name,
            category: scannedProduct.category,
            quantity: 1,
            pricePerUnit: scannedProduct.price,
            isSerialized: false,
            barcodes: [],
            img: { uri: scannedProduct.image_url },
            stockQuantity: scannedProduct.quantity
          };
          setNotification({
            message: `${scannedProduct.name} added to cart`,
            type: "success"
          });
          return [...prevItems, newItem];
        }
      }
    });
  };

  const increaseQuantity = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId && !item.isSerialized) {
          if (item.quantity >= item.stockQuantity) {
            setNotification({
              message: `Cannot add more ${item.name}. Only ${item.stockQuantity} items in stock.`,
              type: "error"
            });
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const decreaseQuantity = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && !item.isSerialized && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const removeBarcode = (itemId: string, barcodeToRemove: string) => {
    setItems(prevItems =>
      prevItems
        .map(item => {
          if (item.id === itemId && item.isSerialized) {
            const updatedBarcodes = item.barcodes.filter(bc => bc !== barcodeToRemove);
            return {
              ...item,
              barcodes: updatedBarcodes,
              quantity: updatedBarcodes.length,
            };
          }
          return item;
        })
        .filter(item => !(item.isSerialized && item.quantity === 0))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isSubmitting,
        notification,
        addItem,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        removeBarcode,
        clearCart,
        setSubmitting: setIsSubmitting,
        setNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 