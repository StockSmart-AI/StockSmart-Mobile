import React, { useState, useEffect, useRef } from "react";
import Svg, { Path } from "react-native-svg";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { ArrowLeft, Search, Zap, ZapOff } from "lucide-react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { router } from "expo-router";
import { BarcodeScanningResult } from "expo-camera";
import { CameraView, Camera } from "expo-camera";

export default function QuickScan() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);
    setData(data);
    router.push("/productDetails");
  };

  const toggleFlash = () => {
    setFlash((current) => !current);
  };

  if (hasPermission === null) return <Text>Requesting permission...</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={32} color={Colors.accent} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={{ fontFamily: Fonts.outfit.medium, fontSize: 20 }}>
          Quick Scan
        </Text>
        <ArrowLeft size={32} color={"transparent"} strokeWidth={1.5} />
      </View>
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
      </View>

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

      <View style={{ flex: 1, justifyContent: "space-between", padding: 24 }}>
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
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            borderWidth: 1,
            borderColor: Colors.text,
            paddingVertical: 16,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Search color={Colors.text} strokeWidth={1.5} size={24} />
          <Text style={{ fontFamily: Fonts.publicSans.regular, fontSize: 18 }}>
            Search
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light,
    gap: 48,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
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
