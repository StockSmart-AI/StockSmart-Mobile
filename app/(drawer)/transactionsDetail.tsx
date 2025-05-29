import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Milk, Boxes, FlaskConical, ShoppingBag, PackagePlus } from "lucide-react-native";
import { Colors, Fonts } from "@/constants/Theme";

// Mock data for demonstration
const transaction = {
  id: 1,
  value: -590,
  date: "September 21, 2024 7:32PM",
  user: "Sara",
  userInitial: "F",
  items: [
    {
      id: 1,
      category: "Beverages",
      name: "Pepsi Soda",
      qty: 4,
      price: 40,
      image: require("@/assets/images/chips.png"),
    },
    {
      id: 2,
      category: "Cosmetics",
      name: "Ennet Nail Polish",
      qty: 2,
      price: 180,
      image: require("@/assets/images/chips.png"),
    },
    {
      id: 3,
      category: "Processed Food",
      name: "Potos Chips",
      qty: 4,
      price: 25,
      image: require("@/assets/images/chips.png"),
    },
    {
      id: 4,
      category: "Miscellaneous",
      name: "Kleenex Onedu",
      qty: 2,
      price: 25,
      image: require("@/assets/images/chips.png"),
    },
  ],
};

export default function TransactionDetail() {
  // const { id } = useLocalSearchParams(); // Use this to fetch real data

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={Colors.text} size={28} />
        </TouchableOpacity>
        
        <View style={{ width: 28 }} /> {/* Spacer for symmetry */}
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.iconCircle}>
          {/* You can use an icon here */}
          <Text style={{ fontSize: 28 }}>💸</Text>
        </View>
        <Text style={styles.valueText}>{transaction.value}ETB</Text>
        <Text style={styles.subText}>from inventory value</Text>
        <Text style={styles.dateText}>{transaction.date}</Text>
        <View style={styles.userRow}>
          <View style={styles.userCircle}>
            <Text style={styles.userInitial}>{transaction.userInitial}</Text>
          </View>
          <Text style={styles.byText}>By {transaction.user}</Text>
        </View>
      </View>

      {/* Items Sold */}
      <Text style={styles.itemsSoldTitle}>{transaction.items.length} items sold</Text>
      <View style={styles.categoryIconsRow}>
        <FlaskConical color={Colors.text} size={22} strokeWidth={1.5} />
        <ShoppingBag color={Colors.text} size={22} strokeWidth={1.5} />
        <Boxes color={Colors.text} size={22} strokeWidth={1.5} />
      </View>

      {/* Sold Items List */}
      {transaction.items.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <Image source={item.image} style={styles.itemImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.itemCategory}>{item.category}</Text>
            <Text style={styles.itemName}>{item.name} × {item.qty}</Text>
          </View>
          <Text style={styles.itemPrice}>{item.price}ETB</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light,
    flex: 1,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontFamily: Fonts.outfit.semiBold,
    fontSize: 18,
    color: Colors.text,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EAF6F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  valueText: {
    color: "#FF4D4F",
    fontSize: 32,
    fontFamily: Fonts.outfit.semiBold,
    marginBottom: 4,
  },
  subText: {
    color: Colors.tertiary,
    fontFamily: Fonts.plusJakarta.regular,
    fontSize: 14,
    marginBottom: 4,
  },
  dateText: {
    color: Colors.tertiary,
    fontFamily: Fonts.plusJakarta.regular,
    fontSize: 14,
    marginBottom: 12,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  userCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  userInitial: {
    color: Colors.light,
    fontFamily: Fonts.outfit.semiBold,
    fontSize: 16,
  },
  byText: {
    color: Colors.text,
    fontFamily: Fonts.plusJakarta.semiBold,
    fontSize: 14,
  },
  itemsSoldTitle: {
    fontFamily: Fonts.outfit.semiBold,
    fontSize: 16,
    marginBottom: 8,
    color: Colors.text,
  },
  categoryIconsRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  itemCategory: {
    fontFamily: Fonts.plusJakarta.medium,
    fontSize: 13,
    color: Colors.tertiary,
  },
  itemName: {
    fontFamily: Fonts.outfit.semiBold,
    fontSize: 15,
    color: Colors.text,
  },
  itemPrice: {
    fontFamily: Fonts.outfit.semiBold,
    fontSize: 15,
    color: Colors.text,
    marginLeft: 8,
  },
});
