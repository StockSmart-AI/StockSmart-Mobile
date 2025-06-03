//@ts-nocheck
import { Colors, Fonts } from "@/constants/Theme";
import { PackagePlus, ShoppingBag } from "lucide-react-native";
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import {
  Boxes,
  Milk,
  Icon,
} from "lucide-react-native";
import {
  bottleChampagne,
  jar,
  bottleBaby,
  bottleDispenser,
  bottlePerfume,
} from "@lucide/lab";
import { router } from "expo-router";
import { getTransactions } from "@/api/transactions";
import { AuthContext } from "@/context/AuthContext";
import { ShopContext } from "@/context/ShopContext";
import * as SecureStore from "expo-secure-store";

const categories = [
  {
    name: "Dairy",
    icon: (color: ColorValue) => (
      <Milk color={color} size={20} strokeWidth={1.5} />
    ),
  },
  {
    name: "Beverage",
    icon: (color: ColorValue) => (
      <Icon
        iconNode={bottleChampagne}
        color={color}
        size={20}
        strokeWidth={1.5}
      />
    ),
  },
  {
    name: "Processed",
    icon: (color: ColorValue) => (
      <Icon iconNode={jar} color={color} size={20} strokeWidth={1.5} />
    ),
  },
  {
    name: "Baby",
    icon: (color: ColorValue) => (
      <Icon iconNode={bottleBaby} color={color} size={20} strokeWidth={1.5} />
    ),
  },
  {
    name: "Cleaning",
    icon: (color: ColorValue) => (
      <Icon
        iconNode={bottleDispenser}
        color={color}
        size={20}
        strokeWidth={1.5}
      />
    ),
  },
  {
    name: "Cosmetics",
    icon: (color: ColorValue) => (
      <Icon
        iconNode={bottlePerfume}
        color={color}
        size={20}
        strokeWidth={1.5}
      />
    ),
  },
  {
    name: "Other",
    icon: (color: ColorValue) => (
      <Boxes color={color} size={20} strokeWidth={1.5} />
    ),
  },
];

const categoryMap = categories.reduce((acc, category) => {
  acc[category.name] = category;
  return acc;
}, {});

const groupByDate = (transactions) => {
  const grouped = {
    today: [],
    yesterday: [],
    earlier: {},
  };

  transactions.forEach((tx) => {
    const date = parseISO(tx.date);

    if (isToday(date)) {
      grouped.today.push(tx);
    } else if (isYesterday(date)) {
      grouped.yesterday.push(tx);
    } else {
      const dateLabel = format(date, "MMMM dd, yyyy");
      if (!grouped.earlier[dateLabel]) {
        grouped.earlier[dateLabel] = [];
      }
      grouped.earlier[dateLabel].push(tx);
    }
  });

  return grouped;
};

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const { currentShop } = useContext(ShopContext);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await SecureStore.getItemAsync("accessToken");
      
      const response = await getTransactions(token, {
        shopId: currentShop?.id,
        page: 1,
        perPage: 10
      });
      const { transactions: fetchedTransactions } = response.data;
      setTransactions(fetchedTransactions);
    } catch (err) {
      setError(err.message || "Failed to fetch transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentShop?.id) {
      fetchTransactions();
    }
  }, [currentShop?.id]);

  const grouped = groupByDate(transactions);

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
        <TouchableOpacity style={styles.retryButton} onPress={fetchTransactions}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Transactions</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        style={styles.scrollView}
      >
        {grouped.today.length > 0 && (
          <>
            <Text style={styles.dateGroupHeader}>Today</Text>
            {grouped.today.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </>
        )}
        {grouped.yesterday.length > 0 && (
          <>
            <Text style={styles.dateGroupHeaderBold}>Yesterday</Text>
            {grouped.yesterday.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </>
        )}
        {Object.keys(grouped.earlier).map((date) => (
          <View key={date}>
            <Text style={styles.dateGroupHeaderBold}>{date}</Text>
            {grouped.earlier[date].map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </View>
        ))}
        {transactions.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const TransactionItem = ({ transaction }) => {
  return (
    <TouchableOpacity 
      style={styles.transactionItemContainer} 
      onPress={() => router.push({ 
        pathname: "/(drawer)/transactionsDetail", 
        params: { id: transaction.id } 
      })}
    >
      <View style={styles.transactionItemRow}>
        <View style={styles.transactionInfoContainer}>
          {transaction.type === "restock" ? (
            <PackagePlus color={Colors.text} strokeWidth={1.5} size={36} />
          ) : (
            <ShoppingBag color={Colors.text} strokeWidth={1.5} size={36} />
          )}
          <View>
            <Text style={styles.transactionTitle}>
              {transaction.items_count} Items {transaction.type === "sale" ? "Sold" : "Restocked"}
            </Text>
            <Text style={styles.transactionTimestamp}>
              {format(parseISO(transaction.date), "p")}
            </Text>
          </View>
        </View>
        <View style={styles.userInfoContainer}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {transaction.user?.name?.charAt(0) || "U"}
            </Text>
          </View>
          <Text style={styles.userNameText}>
            By {transaction.user?.name?.split(" ")[0] || "Unknown"}
          </Text>
        </View>
      </View>
      <View style={styles.transactionDetailsRow}>
        <View style={styles.categoryIconsContainer}>
          {transaction.categories?.slice(0, 3).map((categoryName) => {
            const category = categoryMap[categoryName];
            return category ? (
              <View key={categoryName} style={styles.categoryIconView}>
                {category.icon(Colors.text)}
              </View>
            ) : null;
          })}
          {transaction.categories?.length > 3 && (
            <View style={styles.categoryIconView}>
              <Text style={styles.moreCategoriesText}>
                +{transaction.categories.length - 3}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.transactionAmountText}>
          {transaction.total_amount}ETB
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontFamily: Fonts.outfit.semiBold,
    marginBottom: 20,
    color: Colors.text,
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 70,
  },
  dateGroupHeader: {
    fontFamily: Fonts.plusJakarta.medium,
    fontSize: 15,
    color: Colors.tertiary,
  },
  dateGroupHeaderBold: {
    fontFamily: Fonts.plusJakarta.medium,
    fontSize: 15,
    color: Colors.tertiary,
    marginTop: 32,
  },
  transactionItemContainer: {
    padding: 18,
    elevation: 2,
    backgroundColor: Colors.light,
    borderRadius: 18,
    marginTop: 16,
    gap: 16,
  },
  transactionItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionInfoContainer: {
    flexDirection: "row",
    gap: 14,
  },
  transactionTitle: {
    fontSize: 16,
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
  },
  transactionTimestamp: {
    fontSize: 14,
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.tertiary,
  },
  userInfoContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  userAvatar: {
    width: 32,
    height: 32,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  userAvatarText: {
    fontSize: 14,
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.light,
  },
  userNameText: {
    fontFamily: Fonts.plusJakarta.semiBold,
    fontSize: 14,
    color: Colors.text, // Assuming Colors.text
  },
  transactionDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  categoryIconsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  categoryIconView: {
    width: 36,
    height: 36,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionAmountText: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 18,
    color: Colors.accent,
  },
  moreCategoriesText: {
    fontFamily: Fonts.outfit.semiBold,
    fontSize: 12,
    color: Colors.text,
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  emptyText: {
    color: Colors.tertiary,
    fontSize: 16,
    fontFamily: Fonts.outfit.medium,
  },
});

export default Transactions;
