import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { useShopCreation } from "@/context/ShopCreationContext";

const ShopCreationLoading = () => {
  const { shopDetails } = useShopCreation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const submitData = async () => {
      try {
        const response = await fetch("https://your-api.com/api/shops", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shopDetails),
        });

        if (response.ok) {
          setLoading(false);
          router.push("./index"); // Navigate to dashboard/home
        } else {
          console.error("Error creating shop");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    submitData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Hold on while{"\n"} we <Text style={styles.highlight}>Build</Text> your shop...
      </Text>
      <Image source={require("@/assets/images/holdOnImage.png")} style={styles.image} resizeMode="contain" />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5DAF7B" />
        <Text style={styles.loadingText}>{loading ? "Sending employee invites" : "Shop Created!"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  heading: { fontSize: 32, fontWeight: "600", color: "black" },
  highlight: { color: "#5DAF7B", fontWeight: "bold" },
  image: { width: 257, height: 257, marginVertical: 30 },
  loadingContainer: { width: "100%", backgroundColor: "white", paddingVertical: 20, borderRadius: 10, alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#333" },
});

export default ShopCreationLoading;
