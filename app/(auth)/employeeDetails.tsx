import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, Fonts } from "@/constants/Theme";
import ShopAccessDenied from "./shopAccessDenied"; // Import the new component

const EmployeeDetailsPage = () => {
  const router = useRouter();
  const [shopName, setShopName] = useState("");
  const [isContinueEnabled, setIsContinueEnabled] = useState(false);

  useEffect(() => {
    // Enable the continue button only if there is input in the shop name field
    setIsContinueEnabled(shopName.length > 0);
  }, [shopName]);

  const handleContinue = () => {
    // Always navigate to ShopAccessDenied
    router.push("/(auth)/shopAccessDenied");
  };

  const handleScanQR = () => {
    // TODO: Implement QR code scanning logic
    console.log("Scan QR Code");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>Select your shop</Text>
          <Text style={styles.title}>Which shop do you work at?</Text>
          <Text style={styles.label}>Shop Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Shoa-Merkato"
            value={shopName}
            onChangeText={setShopName}
          />
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.scanQRButton} onPress={handleScanQR}>
            <Text style={styles.scanQRText}>Scan QR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !isContinueEnabled && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isContinueEnabled}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    fontSize: 16,
    fontFamily: Fonts.plusJakarta.medium,
    color: Colors.text,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
    marginBottom: 32,
  },
  label: {
    fontSize: 15,
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    minHeight: 56,
    borderRadius: 16,
    fontFamily: Fonts.plusJakarta.regular,
    fontSize: 15,
    color: Colors.secondary,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  buttonsContainer: {
    gap: 16,
  },
  scanQRButton: {
    backgroundColor: Colors.light,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 48,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  scanQRText: {
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.text,
    fontSize: 17,
  },
  continueButton: {
    backgroundColor: Colors.accent,
    borderRadius: 48,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  continueText: {
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.light,
    fontSize: 17,
  },
  continueButtonDisabled: {
    backgroundColor: "gray", // Change the color to gray when disabled
  },
});

export default EmployeeDetailsPage;