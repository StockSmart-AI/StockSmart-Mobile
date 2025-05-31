import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Colors, Fonts } from "@/constants/Theme";
import { getProductById } from "@/api/stock";
import { AuthContext } from "@/context/AuthContext";
import { ArrowLeft, Minus, Plus, Scan, ChevronUp } from "lucide-react-native";

interface Product {
  id: string;
  name: string;
  shop_id: string;
  price: number;
  quantity: number; // Assuming this is the stock quantity
  threshold: number;
  description: string;
  category: string;
  image_url: string;
}

export default function Restock() {
  const { id } = useLocalSearchParams();
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState("1");

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id || !token) {
        setIsLoading(false);
        setError("Product ID or token missing.");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await getProductById(token, id as string);
        if (response && response.data && response.data.product) {
          setProduct(response.data.product);
          setQuantity(1); // Reset quantity when new product is loaded
        } else {
          setProduct(null);
          setError("Failed to load product details: Unexpected response format.");
          console.error("Failed to load product details: Unexpected response format", response);
        }
      } catch (err: any) {
        console.error("Failed to fetch product details:", err);
        setProduct(null);
        setError(`Failed to load product details: ${err.message || "An error occurred"}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, token]);

  const handleQuantityChange = (amount: number) => {
    const newQuantity = Math.max(1, quantity + amount);
    setQuantity(newQuantity);
    setQuantityInput(newQuantity.toString());
  };

  const handleQuantityInputChange = (text: string) => {
    setQuantityInput(text);
    const numValue = parseInt(text);
    if (!isNaN(numValue) && numValue > 0) {
      setQuantity(numValue);
    }
  };

  const handleQuantityInputBlur = () => {
    const numValue = parseInt(quantityInput);
    if (isNaN(numValue) || numValue < 1) {
      setQuantity(1);
      setQuantityInput("1");
    }
  };

  const handleSell = () => {
    // Implement sell logic here later
    console.log(`Selling ${quantity} of ${product?.name}`);
    // You would typically add the item to a cart or process the sale here.
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Loading Product...</Text>
      </View>
    );
  }

  if (error) {
    return <Text style={{ padding: 32, color: 'red' }}>{error}</Text>;
  }

  if (!product) {
    return <Text style={{ padding: 32 }}>Product not found</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace({ pathname: '/(drawer)/(tabs)/Inventory', params: { source: 'restock' } })}>
          <ArrowLeft size={32} color={Colors.accent} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Sell Product
        </Text>
        <View style={{ width: 32 }} />{/* Placeholder for alignment */}
      </View>

      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image_url }} style={styles.productImage} resizeMode="contain" />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.categoryText}>{product.category}</Text>
          <View style={styles.titlePriceContainer}>
            <View style={{flex: 1, marginRight: 8}}>
              <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
              <Text style={styles.productUnits}>{product.quantity} Units in Stock</Text>
            </View>
            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          </View>

          <View style={styles.quantitySelectorContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(-1)}
            >
              <Minus size={24} color={Colors.accent} strokeWidth={2} />
            </TouchableOpacity>
            <View style={styles.quantityInputContainer}>
              <TextInput
                style={styles.quantityInputText}
                value={quantityInput}
                onChangeText={handleQuantityInputChange}
                onBlur={handleQuantityInputBlur}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(1)}
            >
              <Plus size={24} color={Colors.accent} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Total Value Calculation */}
           <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Value</Text>
            <Text style={styles.totalValue}>${(product.price * quantity).toFixed(2)}</Text>
          </View>

          {/* Start Scanning Button */}
          <TouchableOpacity style={styles.scanButton} onPress={() => router.push({ pathname: '/scanner', params: { type: 'sell' } })}>
            <Scan size={24} color={Colors.light} strokeWidth={1.5} />
            <Text style={styles.scanButtonText}>Start Scanning</Text>
          </TouchableOpacity>

          {/* Manual Entry Button */}
          <TouchableOpacity style={styles.manualEntryButton} onPress={() => { /* Manual entry logic */ }}>
            <Text style={styles.manualEntryButtonText}>Enter Barcode Manually</Text>
            <ArrowLeft size={24} color={Colors.accent} strokeWidth={1.5} style={{ transform: [{ rotate: '180deg' }] }}/>
          </TouchableOpacity>

          {/* Placeholder for Cart */}
          <View style={styles.cartPlaceholder}>
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}>Cart</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                 <Text style={styles.cartItems}>5 items</Text>{/* Static for now */}
                 <ChevronUp size={24} color={Colors.text} strokeWidth={1.5} />
              </View>
            </View>
            <View style={styles.cartTotalContainer}>
               <Text style={styles.cartTotalValue}>345 ETB</Text>{/* Static for now */}
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light,
  },
  loadingText: {
    fontFamily: Fonts.publicSans.regular,
    fontSize: 16,
    color: Colors.text,
    marginTop: 12,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.light,
  },
  scrollViewContainer: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  headerTitle: {
    fontFamily: Fonts.outfit.regular,
    fontSize: 18,
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: Colors.primary,
    height: 300,
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: 24,
  },
  categoryText: {
    color: Colors.secondary,
    fontFamily: Fonts.publicSans.regular,
    fontSize: 15,
    marginBottom: 4,
  },
  titlePriceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 4,
  },
  productName: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 24,
  },
  productUnits: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 15,
    color: Colors.text,
    marginTop: 4,
  },
  productPrice: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 24,
    color: Colors.accent,
  },
  quantitySelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 8,
    justifyContent: 'space-between',
  },
  quantityButton: {
    padding: 8,
  },
  quantityInputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityInputText: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    padding: 0,
    width: '100%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  totalLabel: {
    fontFamily: Fonts.publicSans.regular,
    fontSize: 16,
    color: Colors.text,
  },
  totalValue: {
    fontFamily: Fonts.publicSans.bold,
    fontSize: 20,
    color: Colors.text,
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: Colors.dark,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  scanButtonText: {
    fontFamily: Fonts.publicSans.medium,
    fontSize: 16,
    color: Colors.light,
  },
  manualEntryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 24,
  },
  manualEntryButtonText: {
    fontFamily: Fonts.publicSans.medium,
    fontSize: 16,
    color: Colors.accent,
  },
  cartPlaceholder: {
    marginTop: 32,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartTitle: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 18,
    color: Colors.text,
  },
  cartItems: {
    fontFamily: Fonts.publicSans.regular,
    fontSize: 14,
    color: Colors.text,
    marginRight: 4,
  },
  cartTotalContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  cartTotalValue: {
    fontFamily: Fonts.publicSans.bold,
    fontSize: 20,
    color: Colors.accent,
  },
});
