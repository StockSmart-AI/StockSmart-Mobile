import ProtectedRoute from "@/components/ProtectedRoute";
import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { AuthContext } from "@/context/AuthContext";

export default function HomeScreen() {
  const { logout } = useContext(AuthContext);
  const handleLogut = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to StockSmart</Text>
        <Button title="Logout" onPress={handleLogut} />
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
