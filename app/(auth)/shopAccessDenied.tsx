import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image, // Import Image component
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, Fonts } from "@/constants/Theme";

const ShopAccessDenied = () => {
  const router = useRouter();

  const handleCreateShop = () => {
    // TODO: Implement logic to navigate to shop creation
    router.push("/(shopCreation)/shopName"); // Navigate to shop creation page
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Shop access{"\n"}not permitted yet</Text>
          {/* Add the image here */}
          <Image
            source={require("@/assets/images/employee-small.png")} // Replace with the correct path to your image
            style={styles.image}
            resizeMode="contain" // or "cover" depending on your needs
          />
          <Text style={styles.description}>
            Looks like access to 'Shoa-Merkato' hasn't been granted yet by the
            owner.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.createShopButton}
            onPress={handleCreateShop}
          >
            <Text style={styles.createShopText}>Create Shop</Text>
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
    marginBottom: 24,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.secondary,
    textAlign: "center",
    marginTop: 16,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  createShopButton: {
    backgroundColor: Colors.accent,
    borderRadius: 48,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  createShopText: {
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.light,
    fontSize: 17,
  },
  image: {
    width: 200, // Adjust the width as needed
    height: 200, // Adjust the height as needed
    marginBottom: 16,
  },
});

export default ShopAccessDenied;