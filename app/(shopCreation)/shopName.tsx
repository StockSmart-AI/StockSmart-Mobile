import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, Fonts } from "@/constants/Theme";
import { useShopCreation, Employee } from "@/context/ShopCreationContext";

const ShopNameScreen = () => {
  const router = useRouter();
  const { shopDetails, setShopDetails } = useShopCreation();
  const [shopName, setShopName] = useState(shopDetails.shopName || "");

  return (
    <View style={styles.container}>
      <View style={{ gap: 48 }}>
        <View>
          <Text style={styles.title}>Let's give</Text>
          <Text style={styles.subtitle}>your shop a name!</Text>
        </View>
        <View>
          <Text style={styles.label}>Shop Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Shoa-Merkato"
            placeholderTextColor="#A8B0A8"
            value={shopName}
            onChangeText={setShopName}
          />
        </View>
      </View>
      <TouchableOpacity
        style={[styles.button, !shopName && styles.disabledButton]}
        disabled={!shopName}
        onPress={() => {
          if (shopName) {
            setShopDetails((prev) => ({ ...prev, shopName: shopName.trim() }));
            router.push("/shopLocation");
          }
        }}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    padding: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
    color: Colors.text,
    fontFamily: Fonts.outfit.semiBold,
  },
  subtitle: {
    fontSize: 32,
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontFamily: Fonts.outfit.regular,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 20,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.accent,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 17,
    fontFamily: Fonts.plusJakarta.medium,
    color: "white",
  },
  disabledButton: {
    backgroundColor: Colors.secondary,
  },
});

export default ShopNameScreen;
