import React, { useState, useEffect, useRef } from "react";
import Svg, { Path } from "react-native-svg";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { ArrowLeft, Search, Zap, ZapOff } from "lucide-react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { router } from "expo-router";
import { BarcodeScanningResult } from "expo-camera";
import { CameraView, Camera } from "expo-camera";
import Scanner from "@/components/Scanner";

export default function QuickScan() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);


  const toggleFlash = () => {
    setFlash((current) => !current);
  };

  if (hasPermission === null) return <Text>Requesting permission...</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(drawer)/(tabs)')}>
          <ArrowLeft size={32} color={Colors.accent} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={{ fontFamily: Fonts.outfit.medium, fontSize: 20 }}>
          Quick Scan
        </Text>
        <ArrowLeft size={32} color={"transparent"} strokeWidth={1.5} />
      </View>

      <Scanner type="quick"/>

      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          padding: 24,
        }}
      >
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
