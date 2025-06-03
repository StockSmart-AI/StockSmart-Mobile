import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Milk, Boxes, FlaskConical, ShoppingBag, PackagePlus } from "lucide-react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { getTransactionById } from "@/api/transactions";
import * as SecureStore from "expo-secure-store";
import { format } from "date-fns";

export default function TransactionDetail() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transaction, setTransaction] = useState(null);

  const fetchTransactionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await SecureStore.getItemAsync("accessToken");
      const response = await getTransactionById(token, id);
      setTransaction(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch transaction details");
      console.error("Error fetching transaction details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTransactionDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTransactionDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Transaction not found</Text>
      </View>
    );
  }

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
          {transaction.type === "restock" ? (
            <PackagePlus color={Colors.accent} size={28} strokeWidth={1.5} />
          ) : (
            <ShoppingBag color={Colors.accent} size={28} strokeWidth={1.5} />
          )}
        </View>
        <Text style={[
          styles.valueText,
          { color: transaction.type === "restock" ? Colors.accent : "#FF4D4F" }
        ]}>
          {transaction.total_amount}ETB
        </Text>
        <Text style={styles.subText}>
          {transaction.type === "restock" ? "Restock Cost" : "Sale Amount"}
        </Text>
        <Text style={styles.dateText}>
          {format(new Date(transaction.date), "MMMM dd, yyyy p")}
        </Text>
        <View style={styles.userRow}>
          <View style={styles.userCircle}>
            <Text style={styles.userInitial}>
              {transaction.user?.name?.charAt(0) || "U"}
            </Text>
          </View>
          <Text style={styles.byText}>
            By {transaction.user?.name || "Unknown"}
          </Text>
        </View>
      </View>

      {/* Items List */}
      <Text style={styles.itemsSoldTitle}>
        {transaction.items?.length || 0} items {transaction.type === "restock" ? "restocked" : "sold"}
      </Text>

      {/* Category Icons */}
      <View style={styles.categoryIconsRow}>
        {transaction.categories?.map((category, index) => {
          const Icon = getCategoryIcon(category);
          return Icon ? (
            <Icon key={index} color={Colors.text} size={22} strokeWidth={1.5} />
          ) : null;
        })}
      </View>

      {/* Items List */}
      {transaction.items?.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <Image 
            source={item.image_url ? { uri: item.image_url } : require("@/assets/images/placeholder.png")} 
            style={styles.itemImage} 
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.itemCategory}>{item.category}</Text>
            <Text style={styles.itemName}>
              {item.name} × {item.quantity}
            </Text>
          </View>
          <Text style={styles.itemPrice}>
            {item.price}ETB
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const getCategoryIcon = (category) => {
  const icons = {
    "Dairy": Milk,
    "Beverage": FlaskConical,
    "Processed": Boxes,
    "Baby": Milk,
    "Cleaning": Boxes,
    "Cosmetics": Boxes,
    "Other": Boxes,
  };
  return icons[category] || Boxes;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light,
    flex: 1,
    paddingHorizontal: 16,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
    justifyContent: "space-between",
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
  errorText: {
    color: Colors.error,
    fontSize: 16,
    fontFamily: Fonts.outfit.medium,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.light,
    fontSize: 16,
    fontFamily: Fonts.outfit.semiBold,
  },
});
