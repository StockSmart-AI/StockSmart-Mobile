import { useState, useEffect, useRef, useMemo, useContext } from "react";
import Svg, { Path } from "react-native-svg";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { ArrowLeft, ScanBarcode, Search } from "lucide-react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { router, useLocalSearchParams } from "expo-router";
import Cart from "@/components/Cart";
import SellScanner from "@/components/SellScanner";
import { useCart } from "@/context/CartContext";
import { getProductById, sellProducts } from "@/api/stock";
import { AuthContext } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import SnackBar from "@/components/ui/Snackbar";

// Define CartItem interface to fix linter errors
interface CartItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  pricePerUnit: number;
  isSerialized: boolean;
  barcodes: string[];
  img: any; // Or a more specific image type if available
}

// Sample cart data
const cartData: CartItem[] = []; // Explicitly type the array

export default function Sell() {
  const { id } = useLocalSearchParams();
  const { token } = useContext(AuthContext);
  const { currentShop } = useShop();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);

  const { 
    items: cartItems, 
    isSubmitting,
    notification: cartNotification,
    addItem: handleProductScanned,
    increaseQuantity: handleIncreaseQuantity,
    decreaseQuantity: handleDecreaseQuantity,
    removeItem: handleRemoveItem,
    removeBarcode: handleRemoveBarcode,
    clearCart: handleClearCart,
    setSubmitting: setIsSubmitting,
    setNotification: setCartNotification
  } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || !token) return;
      
      try {
        const response = await getProductById(token, id as string);
        if (response?.data?.product) {
          setProduct(response.data.product);
          // Add the product to cart
          handleProductScanned(response.data.product);
          // Show success notification
          setNotification({
            message: `${response.data.product.name} has been added to cart`,
            type: 'success'
          });
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setNotification({
          message: 'Failed to fetch product details',
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

  const handleConfirm = async () => {
    if (!token || !currentShop?.id) {
      setNotification({
        message: 'Authentication or shop information missing',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare the sell data according to backend requirements
      const sellData = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.pricePerUnit, // Changed from price_per_unit to price to match backend
        barcodes: item.isSerialized ? item.barcodes : [] // Only include barcodes for serialized items
      }));

      const response = await sellProducts(token, {
        shop_id: currentShop.id,
        cart: sellData // The backend expects 'cart' as the key
      });

      if (response?.data) {
        setNotification({
          message: 'Sale completed successfully',
          type: 'success'
        });
      handleClearCart();
        // Navigate back to tabs screen after successful sale
        router.replace('/(drawer)/(tabs)');
      }
    } catch (error: any) {
      console.error('Checkout failed:', error);
      setNotification({
        message: error.response?.data?.error || 'Failed to process sale',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(drawer)/(tabs)')}>
          <ArrowLeft size={32} color={Colors.accent} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={{ fontFamily: Fonts.outfit.medium, fontSize: 20 }}>
          Sell Product
        </Text>
        <ArrowLeft size={32} color={"transparent"} strokeWidth={1.5} />
      </View>

      <View style={styles.contentArea}>
        <SellScanner 
          onProductScanned={handleProductScanned}
          onSearchPress={() => router.push({pathname: '/Inventory', params: {source: 'tab'}})}
        />
      </View>

      <Cart 
        items={cartItems}
        onIncreaseQuantity={handleIncreaseQuantity}
        onDecreaseQuantity={handleDecreaseQuantity}
        onRemoveItem={handleRemoveItem}
        onRemoveBarcode={handleRemoveBarcode}
        onClearCart={handleClearCart}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
      />

      {(notification || cartNotification) && (
        <SnackBar
          type={(notification || cartNotification)?.type || 'info'}
          message={(notification || cartNotification)?.message || ''}
          onClose={() => {
            setNotification(null);
            setCartNotification(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  contentArea: {
    flex: 1,
    paddingBottom: 120,
   }
});
