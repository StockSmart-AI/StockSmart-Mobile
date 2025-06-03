import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Colors, Fonts } from "@/constants/Theme";
import { getProductById, restockProducts } from "@/api/stock";
import { AuthContext } from "@/context/AuthContext";
import { ArrowLeft, Minus, Plus, Scan, ChevronUp, X, Barcode } from "lucide-react-native";
import { RestockScanner } from "@/components/RestockScanner";
import { useShop } from "@/context/ShopContext";
import Snackbar from "@/components/ui/Snackbar";

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
  isSerialized: boolean;
}

interface BarcodeItem {
  barcode: string;
  timestamp: number;
}

export default function Restock() {
  const { id } = useLocalSearchParams();
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState("1");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodeItems, setBarcodeItems] = useState<BarcodeItem[]>([]);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {currentShop} = useShop()
  const [showSnackbar, setShowSnackbar] = useState(false);

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


  const handleAddBarcode = () => {
    if (barcodeInput.trim()) {
      if (!barcodeItems.some(item => item.barcode === barcodeInput.trim())) {
        setBarcodeItems(prev => [...prev, {
          barcode: barcodeInput.trim(),
          timestamp: Date.now() + Math.random(),
        }]);
        setBarcodeInput("");
      } else {
        console.log("Barcode already exists in the list.");
      }
    }
  };

  const handleRemoveBarcode = (timestamp: number) => {
    setBarcodeItems(prev => prev.filter(item => item.timestamp !== timestamp));
  };

  const handleOpenScanner = () => {
    setIsScannerVisible(true);
  };

  const handleScannedBarcodes = (scannedData?: string[]) => {
    if (scannedData && scannedData.length > 0) {
      const newBarcodes = scannedData.filter(scannedBarcode => 
        !barcodeItems.some(existingItem => existingItem.barcode === scannedBarcode)
      );
      const newBarcodeItems = newBarcodes.map(barcode => ({
        barcode,
        timestamp: Date.now() + Math.random(),
      }));
      setBarcodeItems(prev => [...prev, ...newBarcodeItems]);
    }
    setIsScannerVisible(false);
  };

  const handleConfirmRestock = async () => {
    if (!product || !token) return;

    try {
      setIsSubmitting(true);
      
      const restockData = {
        shop_id: currentShop?.id, 
        product_id: product.id,
        cost_price: product.price * quantity,
        quantity: quantity,
        barcodes: product.isSerialized ? barcodeItems.map(item => item.barcode) : []
      };

      const response = await restockProducts(token, restockData);
      
      console.log(response.status)
      if (response.status == 201) {
        setShowSnackbar(true);
        setTimeout(() => {
          router.replace('/(drawer)/(tabs)');
        }, 1000);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to restock products. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
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
          Restock Product
        </Text>
        <View style={{ width: 32 }} />{/* Placeholder for alignment */}
      </View>

      <ScrollView style={[styles.scrollViewContainer, { marginBottom: 80 }]}>
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

          {/* Only show scanning and barcode features for serialized products */}
          {product.isSerialized && (
            <>
              {/* Start Scanning Button */}
              <TouchableOpacity style={styles.scanButton} onPress={handleOpenScanner}>
                <Scan size={24} color={Colors.light} strokeWidth={1.5} />
                <Text style={styles.scanButtonText}>Start Scanning ({quantity} items)</Text>
              </TouchableOpacity>

              {/* Divider with OR text */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Manual Entry Section */}
              <View style={styles.manualEntryContainer}>
                <View style={styles.barcodeInputContainer}>
                  <TextInput
                    style={styles.barcodeInput}
                    value={barcodeInput}
                    onChangeText={setBarcodeInput}
                    placeholder="Enter barcode"
                    placeholderTextColor={Colors.tertiary}
                    keyboardType="numeric"
                    maxLength={13}
                  />
                  <TouchableOpacity 
                    style={styles.addBarcodeButton}
                    onPress={handleAddBarcode}
                  >
                    <ArrowLeft size={24} color={Colors.accent} strokeWidth={1.5} style={{ transform: [{ rotate: '180deg' }] }}/>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Barcode Items Container */}
              <View style={styles.barcodeItemsContainer}>
                <View style={styles.barcodeItemsHeader}>
                  <Text style={styles.barcodeItemsTitle}>Scanned Items</Text>
                  <Text style={styles.barcodeItemsCount}>{barcodeItems.length} items</Text>
                </View>
                <ScrollView style={styles.barcodeItemsList}>
                  {barcodeItems.map((item) => (
                    <View key={item.timestamp} style={styles.barcodeItem}>
                      <View style={styles.barcodeItemContent}>
                        <Barcode size={20} color={Colors.light} strokeWidth={1.5} />
                        <Text style={styles.barcodeItemText}>{item.barcode}</Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => handleRemoveBarcode(item.timestamp)}
                        style={styles.removeBarcodeButton}
                      >
                        <X size={20} color={Colors.light} strokeWidth={1.5} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </>
          )}

        </View>
      </ScrollView>

      {/* Fixed Confirm Button */}
      <View style={styles.confirmButtonContainer}>
        <TouchableOpacity 
          style={[styles.confirmButton, isSubmitting && styles.confirmButtonDisabled]}
          onPress={handleConfirmRestock}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.light} />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Restock</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Restock Scanner Modal */}
      {product.isSerialized && (
        <RestockScanner 
          isVisible={isScannerVisible}
          onClose={handleScannedBarcodes}
          targetQuantity={quantity}
        />
      )}

      {showSnackbar && (
        <Snackbar
          type="success"
          message="Products have been restocked successfully"
          onClose={() => setShowSnackbar(false)}
        />
      )}
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
    borderRadius: 18,
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.primary,
  },
  dividerText: {
    fontFamily: Fonts.publicSans.regular,
    fontSize: 14,
    color: Colors.text,
    marginHorizontal: 16,
  },
  manualEntryContainer: {
    marginTop: 16,
  },
  barcodeInputContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 8,
    alignItems: 'center',
  },
  barcodeInput: {
    flex: 1,
    fontFamily: Fonts.publicSans.medium,
    fontSize: 16,
    color: Colors.text,
    paddingHorizontal: 12,
  },
  addBarcodeButton: {
    padding: 8,
  },
  barcodeItemsContainer: {
    marginTop: 32,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
  },
  barcodeItemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  barcodeItemsTitle: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 18,
    color: Colors.text,
  },
  barcodeItemsCount: {
    fontFamily: Fonts.publicSans.regular,
    fontSize: 14,
    color: Colors.text,
  },
  barcodeItemsList: {
    maxHeight: 200,
  },
  barcodeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.tertiary,
    borderRadius: 18,
    padding: 12,
    marginBottom: 8,
  },
  barcodeItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barcodeItemText: {
    fontFamily: Fonts.publicSans.regular,
    fontSize: 14,
    color: Colors.light,
  },
  removeBarcodeButton: {
    padding: 4,
  },
  confirmButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.primary,
  },
  confirmButton: {
    backgroundColor: Colors.accent,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 16,
    color: Colors.light,
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
});
