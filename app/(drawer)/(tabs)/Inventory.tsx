import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const Dashboard = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Stock Overview</Text>
        <Text style={styles.cardContent}>
          Here you can see an overview of your stocks.
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Market Trends</Text>
        <Text style={styles.cardContent}>Latest trends in the market.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Portfolio Performance</Text>
        <Text style={styles.cardContent}>
          Track your portfolio performance.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    color: "#666",
  },
});

export default Dashboard;
