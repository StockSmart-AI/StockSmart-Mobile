import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, Fonts } from "@/constants/Theme";
import { useShopCreation, Employee } from "@/context/ShopCreationContext";

const ShopLocationScreen = () => {
  const router = useRouter();
  const { shopDetails, setShopDetails } = useShopCreation();
  const [street, setStreet] = useState(shopDetails.street || "");
  const [building, setBuilding] = useState(shopDetails.building || "");
  const [unit, setUnit] = useState(shopDetails.unit || "");

  return (
    <View style={styles.container}>
      <View style={{ gap: 16 }}>
        <View>
          <Text style={styles.title}>Where is</Text>
          <Text style={styles.subtitle}>your shop located?</Text>
        </View>
        <Text style={styles.label}>Street name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Merkato"
          placeholderTextColor="#A8B0A8"
          value={street}
          onChangeText={setStreet}
        />
        <View>
          <Text style={styles.label}>Building name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Tiret Shopping Center bldg."
            placeholderTextColor="#A8B0A8"
            value={building}
            onChangeText={setBuilding}
          />
        </View>
        <View>
          <Text style={styles.label}>Unit number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. shop number 12B"
            placeholderTextColor="#A8B0A8"
            value={unit}
            onChangeText={setUnit}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          !street && !building && !unit && styles.disabledButton,
        ]}
        disabled={!street || !building || !unit}
        onPress={() => {
          if (street && building && unit) {
            setShopDetails((prev) => ({
              ...prev,
              street: street.trim(),
              building: building.trim(),
              unit: unit.trim(),
            }));
            router.push("/addEmployee");
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
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
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
    color: Colors.text,
    marginBottom: 5,
  },
  input: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 20,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.accent,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: Fonts.plusJakarta.medium,
    fontSize: 17,
    color: Colors.light,
  },
  disabledButton: {
    backgroundColor: Colors.secondary,
  },
});

export default ShopLocationScreen;
