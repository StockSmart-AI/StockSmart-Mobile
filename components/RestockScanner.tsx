import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import Svg, { Path } from "react-native-svg";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Modal, // Import Modal
} from "react-native";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Search,
  Zap,
  ZapOff,
  X, // Import X icon
  ShoppingBag, // Import ShoppingBag icon
} from "lucide-react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { router } from "expo-router";
import { BarcodeScanningResult } from "expo-camera";
import { CameraView, Camera } from "expo-camera";
import Cart from "@/components/Cart";
import { getProductByBarcode } from "@/api/stock";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import SnackBar from "@/components/ui/Snackbar";

interface RestockScannerProps {
  isVisible: boolean; // Prop to control visibility
  onClose: (scannedData?: string[]) => void; // Callback on close
  targetQuantity?: number; // Target quantity for restock
}

export const RestockScanner = ({ isVisible, onClose, targetQuantity }: RestockScannerProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const { token } = useContext(AuthContext);
  const { currentShop } = useShop();
  const [scannedBarcodes, setScannedBarcodes] = useState<string[]>([]);
  const initialScanCount = useRef(0);
  const progressBarAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

   useEffect(() => {
    if (isVisible) {
        setScanned(false); // Reset scanned state when modal opens
        setData(null);
        setError(null);
        setScannedBarcodes([]); // Clear previous scanned barcodes
        initialScanCount.current = 0;
        // Reset animation when modal opens
        progressBarAnimation.setValue(0);

    } else {
        if (scannedBarcodes.length > 0) {
            onClose(scannedBarcodes);
        } else {
             onClose();
        }

    }
  }, [isVisible]); // Depend on isVisible

  // Update progress bar animation when scannedBarcodes or targetQuantity changes
  useEffect(() => {
      if (targetQuantity !== undefined && targetQuantity > 0) {
          const progress = scannedBarcodes.length / targetQuantity;
          Animated.timing(progressBarAnimation, {
              toValue: progress,
              duration: 300, // Animation duration
              useNativeDriver: false, // set to false for layout animations
          }).start();
      } else {
           Animated.timing(progressBarAnimation, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
          }).start();
      }
  }, [scannedBarcodes.length, targetQuantity]);

  const handleBarCodeScanned = async ({ type: barcodeType, data: barcodeData }: BarcodeScanningResult) => {
    setScanned(true);
    setData(barcodeData);
    
    if (!scannedBarcodes.includes(barcodeData)) { // Prevent scanning the same barcode twice in one session
        const newBarcodeList = [...scannedBarcodes, barcodeData];
        setScannedBarcodes(newBarcodeList);
        
        if (targetQuantity && newBarcodeList.length >= targetQuantity) {
            // If target quantity reached, close modal after a short delay
            setTimeout(() => {
                onClose(newBarcodeList);
            }, 500); // Give a moment for UI update
        } else {
            // Allow scanning again after a short delay
             setTimeout(() => setScanned(false), 1000); // Wait 1 second before allowing next scan
        }
    } else {
         setError({ message: "Barcode already scanned.", type: "info" });
         setTimeout(() => {
             setError(null);
             setScanned(false); // Allow scanning again
         }, 1500); // Show info message briefly
    }
  };

  const handleSnackbarClose = () => {
    setError(null);
    setScanned(false); // Reset scanned state to allow scanning again
  };

  const toggleFlash = () => {
    setFlash((current) => !current);
  };

  const handleConfirmScan = () => {
      // TODO: Implement logic to add scanned barcodes to restock list
      console.log("Confirming scan for barcodes:", scannedBarcodes);
      onClose(scannedBarcodes); // Pass scanned data back and close modal
  };

  // Only render if visible
  if (!isVisible) return null;

  if (hasPermission === null) return <Text>Requesting permission...</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  const scannedCount = scannedBarcodes.length;
  const remainingCount = targetQuantity ? targetQuantity - scannedCount : 0;
  const progressWidth = progressBarAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
  });

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={() => onClose()}
      transparent={true}
    >
      <View style={styles.modalContainer}>
        {/* Content Wrapper */}
        <View style={styles.contentWrapper}>
            <Text
              style={styles.scannerTitle}
            >
              Scanner
            </Text>
            <Text
              style={styles.scannerSubtitle}
            >
              Fit the product's barcode inside the box to scan.
            </Text>

            <View style={styles.cameraContainer}>
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
              {/* Adjusted styles and added enableTorch prop */}
              <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                enableTorch={flash} 
                barcodeScannerSettings={{
                  barcodeTypes: ["ean13", "code128"], // Specify barcode types if needed
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
            {error && (
              <SnackBar
                type={error.type}
                message={error.message}
                onClose={handleSnackbarClose}
              />
            )}
         </View>
          {/* Progress Bar Container */}
          {targetQuantity !== undefined && targetQuantity > 0 && (
              <View style={styles.progressBarContainer}>
                  {/* Progress Text */}
                  <View style={styles.progressTextRow}>
                      <Text style={styles.progressLabel}>Scanned: <Text style={styles.progressCount}>{scannedCount}</Text></Text>
                      <Text style={styles.progressLabel}>Remaining: <Text style={styles.progressCount}>{remainingCount}</Text></Text>
                  </View>
                  {/* Progress Bar */}
                  <View style={styles.progressBarBackground}>
                      <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
                  </View>
              </View>
          )}
          {/* Close Button */}
            <TouchableOpacity onPress={() => onClose()} style={styles.closeButton}>
                <X size={36} color={Colors.light} strokeWidth={1.5} />
            </TouchableOpacity>
        </View>
        {/* Confirm Button */}
          {targetQuantity !== undefined && targetQuantity > 0 && scannedCount > 0 && (
              <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={handleConfirmScan}
              >
                  <ShoppingBag color={Colors.light} size={24} strokeWidth={1.5} />
                  <Text style={styles.confirmButtonText}>Confirm ({scannedCount})</Text>
              </TouchableOpacity>
          )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 80, // Add padding at the bottom for the fixed button
  },
   contentWrapper: {
       gap: 10,
       alignItems: 'center',
   },
   closeButton: {
       padding: 10,
       marginTop: 20,
   },
   scannerTitle: {
     fontFamily: Fonts.outfit.semiBold,
     fontSize: 24,
     color: Colors.light,
     textAlign: "center",
   },
    scannerSubtitle: {
      fontFamily: Fonts.publicSans.light,
      fontSize: 16,
      color: Colors.primary, // Changed to primary as per user's edit
      textAlign: "center",
    },
  cameraContainer: {
    alignSelf: "center",
    width: 290,
    height: 290,
    justifyContent: "center",
    alignItems: "center",
     marginTop: 20,
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
       color: Colors.primary, // Changed to primary as per user's edit
       textAlign: 'center',
   },
   progressBarContainer: {
       paddingHorizontal: 8, 
       marginTop: 56, // Changed to 56 as per user's edit
       width: '100%',
   },
   progressTextRow: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       marginBottom: 8,
   },
   progressLabel: {
       fontFamily: Fonts.publicSans.regular,
       fontSize: 14,
       color: Colors.light,
   },
    progressCount: {
        fontFamily: Fonts.publicSans.semiBold,
        fontSize: 14,
        color: Colors.light,
    },
   progressBarBackground: {
       height: 8,
       backgroundColor: Colors.tertiary, 
       borderRadius: 4,
       overflow: 'hidden', 
   },
   progressBarFill: {
       height: '100%',
       backgroundColor: Colors.accent, 
       borderRadius: 4,
   },
   // Confirm Button Styles
    confirmButton: {
       position: 'absolute',
       bottom: 0,
       left: 0,
       right: 0,
       backgroundColor: Colors.accent, // Use accent color for the button
       paddingVertical: 16, // Vertical padding
       flexDirection: 'row',
       justifyContent: 'center',
       alignItems: 'center',
       gap: 8,
   },
   confirmButtonText: {
       fontFamily: Fonts.publicSans.semiBold,
       fontSize: 18,
       color: Colors.light, // Text color for the button
   }
}); 