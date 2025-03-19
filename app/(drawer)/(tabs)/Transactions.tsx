import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const transactions = [
  { id: "1", title: "Groceries", amount: "$50.00", date: "2023-10-01" },
  { id: "2", title: "Rent", amount: "$1200.00", date: "2023-10-01" },
  { id: "3", title: "Utilities", amount: "$150.00", date: "2023-10-02" },
  // Add more transactions as needed
];

const Transactions = () => {
  const renderItem = ({ item }: any) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.amount}>{item.amount}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transactions</Text>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
  },
  amount: {
    fontSize: 16,
    color: "green",
  },
  date: {
    fontSize: 14,
    color: "gray",
  },
});

export default Transactions;
