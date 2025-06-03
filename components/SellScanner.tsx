import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Image,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Zap, ZapOff, ShoppingBag, Search } from "lucide-react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { CameraView, Camera } from "expo-camera";
import { BarcodeScanningResult } from "expo-camera";
import { getProductByBarcode } from "@/api/stock";
import { AuthContext } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import SnackBar from "@/components/ui/Snackbar";

interface SellScannerProps {
  onProductScanned: (product: any) => void;
  onSearchPress?: () => void;
}

const SellScanner: React.FC<SellScannerProps> = ({ onProductScanned, onSearchPress }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [barcode, setBarcode] = useState("")

  const { token } = useContext(AuthContext);
  const { currentShop } = useShop();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data: barcodeData }: BarcodeScanningResult) => {
    if (scanned || isLoadingProduct) return; // Prevent multiple scans/fetches

    setScanned(true);
    setBarcode(barcodeData);
    setIsLoadingProduct(true);
    setError(null); // Clear previous errors
    setScannedProduct(null); // Clear previous product details

    if (!token || !currentShop?.id) {
      setError({ message: "Authentication or shop information missing", type: "error" });
      setIsLoadingProduct(false);
      setScanned(false); // Allow rescanning
      return;
    }

    try {
      const response = await getProductByBarcode(token, barcodeData, currentShop.id);
      if (response?.data) {
        setScannedProduct(response.data[0][barcodeData]);
        // Keep scanned true to show product details, will be reset after adding to cart or cancelling
      } else {
        setError({ message: "Product not found for this barcode.", type: "error" });
        setScannedProduct(null);
        setTimeout(() => setScanned(false), 2000); // Allow scanning again after 2 seconds
      }
    } catch (err: any) {
      console.error("Failed to fetch product details:", err);
      setError({
        message: err.response?.data?.error || "Failed to fetch product details.",
        type: "error",
      });
      setScannedProduct(null);
      setTimeout(() => setScanned(false), 2000); // Allow scanning again after 2 seconds
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const handleAddToCart = () => {
    if (scannedProduct) {
      // Pass the scanned product including the barcode data if needed by the parent
      onProductScanned({
          ...scannedProduct,
          scannedBarcode: barcode, // Assuming the product object from API has a barcode field
      });
      // Reset state to show scanner again
      setScannedProduct(null);
      setScanned(false);
      setError(null);
      console.log(scannedProduct) // Clear any errors after successful add
    }
  };

  const handleCancel = () => {
      setScannedProduct(null);
      setScanned(false);
      setError(null);
  };

  const handleSnackbarClose = () => {
    setError(null);
    if (!scannedProduct) { // Only reset scanned if not showing product details
      setScanned(false);
    }
  };

  const toggleFlash = () => {
    setFlash((current) => !current);
  };

  if (hasPermission === null) return <Text>Requesting permission...</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      {/* Scanner View */}
      {!scannedProduct && !isLoadingProduct && (
        <View style={styles.scannerContent}>
          <Text style={styles.scannerTitle}>Scanner</Text>
          <Text style={styles.scannerSubtitle}>Fit the product's barcode inside the box to scan.</Text>
          <View style={styles.cameraBox}>
             <Svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                style={{ position: "absolute", right: 0, top: 0 }} // Top Right
              >
                <Path
                  d="M2 2H34C38.4183 2 42 5.58172 42 10V42"
                  stroke={Colors.accent}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              </Svg>
               <Svg
                width="44"
                height="44"
                viewBox="0 0 44 44" // Top Left
                fill="none"
                 style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  transform: [{ rotate: "270deg" }],
                }}
              >
                <Path
                  d="M2 2H34C38.4183 2 42 5.58172 42 10V42"
                  stroke={Colors.accent}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              </Svg>
               <Svg
                width="44"
                height="44"
                viewBox="0 0 44 44" // Bottom Left
                fill="none"
                 style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  transform: [{ rotate: "180deg" }],
                }}
              >
                <Path
                  d="M2 2H34C38.4183 2 42 5.58172 42 10V42"
                  stroke={Colors.accent}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              </Svg>
               <Svg
                width="44"
                height="44"
                viewBox="0 0 44 44" // Bottom Right
                fill="none"
                 style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  transform: [{ rotate: "90deg" }],
                }}
              >
                <Path
                  d="M2 2H34C38.4183 2 42 5.58172 42 10V42"
                  stroke={Colors.accent}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              </Svg>
            <CameraView
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              enableTorch={flash}
              barcodeScannerSettings={{
                barcodeTypes: ["ean13", "code128"],
              }}
              style={styles.camera}
            />
          </View>
           <TouchableOpacity
              style={styles.flashButton}
              onPress={toggleFlash}
            >
              {!flash ? (
                <Zap size={32} color={Colors.accent} strokeWidth={1} />
              ) : (
                <ZapOff size={32} color={Colors.accent} strokeWidth={1} />
              )}
              <Text
                style={styles.flashButtonText}
              >
                Torch
              </Text>
            </TouchableOpacity>

            {/* Search Button - Only show when scanner is visible */}
            {onSearchPress && (
              <TouchableOpacity
                style={styles.searchButton}
                onPress={onSearchPress}
              >
                <Search color={Colors.text} strokeWidth={1.5} size={24} />
                <Text style={styles.searchButtonText}>
                  Search
                </Text>
              </TouchableOpacity>
            )}
        </View>
      )}

      {/* Loading Indicator */}
      {isLoadingProduct && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Fetching Product Info...</Text>
        </View>
      )}

      {/* Product Details View */}
      {scannedProduct && !isLoadingProduct && (
        <View style={styles.productDetailsContainer}>
           <View style={styles.imageContainer}>
            <Image source={{ uri: scannedProduct.image_url }} style={styles.productImage} resizeMode="contain" />
          </View>
           <View style={styles.detailsContentContainer}>
             <Text style={styles.categoryText}>{scannedProduct.category}</Text>
             <View style={styles.titlePriceContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.productName} numberOfLines={2}>{scannedProduct.name}</Text>
                   {/* Display available stock if not serialized, or quantity 1 if serialized for scanning */} 
                  <Text style={styles.productUnits}>{scannedProduct.isSerialized ? '1 Unit' : `${scannedProduct.quantity} Units`} in Stock</Text>
                </View>
               <Text style={styles.productPrice}>${scannedProduct.price.toFixed(2)}</Text>
             </View>

              {/* Add to Cart Button */} 
              <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                 <ShoppingBag color={Colors.light} size={24} strokeWidth={1.5} />
                 <Text style={styles.addToCartButtonText}>Add to cart</Text>
              </TouchableOpacity>

              {/* Cancel Button */} 
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                 <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
           </View>
        </View>
      )}

      {/* Snackbar for Errors */} 
      {error && (
        <SnackBar
          type={error.type}
          message={error.message}
          onClose={handleSnackbarClose}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scannerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 16,
  },
  scannerTitle: {
    fontFamily: Fonts.outfit.semiBold,
    fontSize: 24,
    color: Colors.text,
    textAlign: "center",
  },
  scannerSubtitle: {
    fontFamily: Fonts.publicSans.light,
    fontSize: 16,
    color: Colors.tertiary,
    textAlign: "center",
    marginBottom: 20,
  },
   cameraBox: {
    alignSelf: "center",
    width: 290,
    height: 290,
    justifyContent: "center",
    alignItems: "center",
     // Removed specific top margin
  },
  camera: {
    height: 250,
    width: 250,
  },
   flashButton: {
       alignSelf: "center", 
       gap: 4,
       marginTop: 20,
   },
   flashButtonText: {
       fontSize: 14,
       fontFamily: Fonts.publicSans.light,
       color: Colors.tertiary,
       textAlign: 'center',
   },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
       fontFamily: Fonts.publicSans.regular,
       fontSize: 16,
       color: Colors.text,
       marginTop: 12,
    },
    productDetailsContainer: {
        flex: 1,
        width: '100%',
    },
     imageContainer: {
        width: '100%',
        height: 300,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
         // Removed margins
      },
    productImage: {
        width: '100%',
        height: '100%',
    },
     detailsContentContainer: {
         padding: 24,
         gap: 16,
     },
    categoryText: {
        color: Colors.secondary,
        fontFamily: Fonts.publicSans.regular,
        fontSize: 15,
        // Removed explicit bottom margin
      },
    titlePriceContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
      },
    titleContainer: {
        flex: 1,
    },
    productName: {
        fontFamily: Fonts.publicSans.semiBold,
        fontSize: 20,
        marginBottom: 4,
      },
    productUnits: {
        fontFamily: Fonts.publicSans.semiBold,
        fontSize: 14,
        color: Colors.text,
      },
    productPrice: {
        fontFamily: Fonts.publicSans.semiBold,
        fontSize: 20,
        color: Colors.accent,
      },
     addToCartButton: {
       flexDirection: 'row',
       backgroundColor: Colors.dark,
       borderRadius: 18,
       paddingVertical: 16,
       alignItems: 'center',
       justifyContent: 'center',
       gap: 8,
     },
     addToCartButtonText: {
       fontFamily: Fonts.publicSans.medium,
       fontSize: 16,
       color: Colors.light,
     },
      // Added styles for the Cancel button
      cancelButton: {
        borderRadius: 18,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.text,
        justifyContent: 'center',
      },
      cancelButtonText: {
        fontFamily: Fonts.publicSans.semiBold,
        fontSize: 16,
        color: Colors.text,
      },
  searchButton: {
    display: "flex",
    flexDirection: "row",
    width: '80%',
    borderWidth: 1,
    borderColor: Colors.text,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  searchButtonText: {
    fontFamily: Fonts.publicSans.regular,
    fontSize: 18,
  },
});

export default SellScanner; 