import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import Svg, { Path } from "react-native-svg";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Search,
  Zap,
  ZapOff,
} from "lucide-react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { router } from "expo-router";
import { BarcodeScanningResult } from "expo-camera";
import { CameraView, Camera } from "expo-camera";
import Cart from "@/components/Cart";
import { getProductByBarcode } from "@/api/stock";
import { AuthContext } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import SnackBar from "@/components/ui/Snackbar";

interface ScannerProps {
  type?: 'quick' | 'delete';
  onBarcodeScanned?: (result: BarcodeScanningResult) => void;
}

const Scanner: React.FC<ScannerProps> = ({ type = 'quick', onBarcodeScanned }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const { token } = useContext(AuthContext);
  const { currentShop } = useShop();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    if (type === 'delete' && onBarcodeScanned) {
      onBarcodeScanned(result);
      return;
    }

    if (!token || !currentShop?.id) {
      setError({ message: "Authentication or shop information missing", type: "error" });
      return;
    }

    setScanned(true);
    setData(result.data);

    try {
      const response = await getProductByBarcode(token, result.data, currentShop.id);
      if (response.data && response.data[0]) {
        router.push({
          pathname: "/(drawer)/(stock)/productDetails",
          params: { id: response.data[0][result.data].id }
        });
      } else {
        setError({ message: "Product not found", type: "error" });
        setTimeout(() => setScanned(false), 2000);
      }
    } catch (err: any) {
      setError({ 
        message: err.response?.data?.error || "Failed to fetch product details", 
        type: "error" 
      });
      setTimeout(() => setScanned(false), 2000);
    }
  };

  const handleSnackbarClose = () => {
    setError(null);
    setScanned(false); // Reset scanned state to allow scanning again
  };

  const toggleFlash = () => {
    setFlash((current) => !current);
  };

  if (hasPermission === null) return <Text>Requesting permission...</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={{ paddingHorizontal: 16, gap: 10 }}>
      <Text
        style={{
          fontFamily: Fonts.outfit.semiBold,
          fontSize: 24,
          color: Colors.text,
          textAlign: "center",
        }}
      >
        Scanner
      </Text>
      <Text
        style={{
          fontFamily: Fonts.publicSans.light,
          fontSize: 16,
          color: Colors.tertiary,
          textAlign: "center",
        }}
      >
        Fit the product's barcode inside the box to scan.
      </Text>
      <View style={styles.cameraContainer}>
        <Svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          style={{ position: "absolute", right: 0, top: 0 }}
        >
          <Path
            d="M2 2H34C38.4183 2 42 5.58172 42 10V42"
            stroke="#7ED1A7"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </Svg>
        <Svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
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
            stroke="#7ED1A7"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </Svg>
        <Svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
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
            stroke="#7ED1A7"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </Svg>
        <Svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
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
            stroke="#7ED1A7"
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
        style={{ alignSelf: "center", gap: 4 }}
        onPress={toggleFlash}
      >
        {!flash ? (
          <Zap size={32} color={Colors.text} strokeWidth={1} />
        ) : (
          <ZapOff size={32} color={Colors.text} strokeWidth={1} />
        )}
        <Text
          style={{
            fontSize: 14,
            fontFamily: Fonts.publicSans.light,
            color: Colors.tertiary,
          }}
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
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    alignSelf: "center",
    width: 290,
    height: 290,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    height: 250,
    width: 250,
  },
});

export default Scanner;