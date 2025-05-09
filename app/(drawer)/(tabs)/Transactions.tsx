//@ts-nocheck
import { Colors, Fonts } from "@/constants/Theme";
import { CalendarDays, PackagePlus, ShoppingBag } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Boxes,
  ArrowLeft,
  Milk,
  Icon,
  CircleOff,
  Barcode,
  ImagePlus,
  X,
} from "lucide-react-native";
import {
  bottleChampagne,
  jar,
  bottleBaby,
  bottleDispenser,
  bottlePerfume,
} from "@lucide/lab";

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
    const date = parseISO(tx.date); // Convert to Date object

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

const transactions = [
  {
    id: 2,
    type: "sale",
    itemsCount: 5,
    user: "Fasil",
    userInitial: "F",
    categories: ["Beverage", "Dairy", "Processed"],
    price: 212,
    date: new Date().toISOString(), // Today
    title: "Sale Transaction",
  },
  {
    id: 8,
    type: "sale",
    itemsCount: 7,
    user: "Fasil",
    userInitial: "F",
    categories: ["Beverage", "Dairy", "Processed", "Cosmetics"],
    price: 432,
    date: new Date().toISOString(), // Today
    title: "Sale Transaction",
  },
  {
    id: 3,
    type: "restock",
    itemsCount: 10,
    user: "John Doe",
    userInitial: "JD",
    categories: ["Cleaning", "Cosmetics"],
    price: 150, // Or perhaps cost for restock
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    title: "Restock Event",
  },
  {
    id: 4,
    type: "sale",
    itemsCount: 3,
    user: "Jane Smith",
    userInitial: "JS",
    categories: ["Baby"],
    price: 75,
    date: "2024-03-10T14:30:00Z", // Earlier
    title: "Baby Products Sale",
  },
  {
    id: 5,
    type: "restock",
    itemsCount: 20,
    user: "Admin",
    userInitial: "A",
    categories: ["Other", "Dairy"],
    price: 300,
    date: "2024-03-10T09:00:00Z", // Earlier on the same day
    title: "Morning Restock",
  },
];

const Transactions = () => {
  const grouped = groupByDate(transactions);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Transactions</Text>
        <TouchableOpacity onPress={() => setShow(true)}>
          <CalendarDays color={Colors.text} size={28} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          accentColor={Colors.accent}
        />
      )}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        style={styles.scrollView}
      >
        {grouped.today.length > 0 && (
          <>
            <Text style={styles.dateGroupHeader}>Today</Text>
            {grouped.today.map((tx) => (
              <View key={tx.id} style={styles.transactionItemContainer}>
                <View style={styles.transactionItemRow}>
                  <View style={styles.transactionInfoContainer}>
                    {tx.type === "restock" ? (
                      <PackagePlus
                        color={Colors.text}
                        strokeWidth={1.5}
                        size={36}
                      />
                    ) : (
                      <ShoppingBag
                        color={Colors.text}
                        strokeWidth={1.5}
                        size={36}
                      />
                    )}
                    <View>
                      <Text style={styles.transactionTitle}>
                        {tx.itemsCount} Items{" "}
                        {tx.type === "sale" ? "Sold" : "Restocked"}
                      </Text>
                      <Text style={styles.transactionTimestamp}>
                        {format(parseISO(tx.date), "p")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.userInfoContainer}>
                    <View style={styles.userAvatar}>
                      <Text style={styles.userAvatarText}>
                        {tx.userInitial}
                      </Text>
                    </View>
                    <Text style={styles.userNameText}>
                      By {tx.user.split(" ")[0]}
                    </Text>
                  </View>
                </View>
                <View style={styles.transactionDetailsRow}>
                  <View style={styles.categoryIconsContainer}>
                    {Array.isArray(tx.categories) &&
                      tx.categories.slice(0, 3).map((categoryName) => {
                        const category = categoryMap[categoryName];
                        return category ? (
                          <View
                            key={categoryName}
                            style={styles.categoryIconView}
                          >
                            {category.icon(Colors.text)}
                          </View>
                        ) : null;
                      })}

                    {Array.isArray(tx.categories) &&
                      tx.categories.length > 3 && (
                        <View style={styles.categoryIconView}>
                          <Text style={styles.moreCategoriesText}>
                            +{tx.categories.length - 3}
                          </Text>
                        </View>
                      )}
                  </View>
                  <Text style={styles.transactionAmountText}>
                    {tx.price}ETB
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}
        {grouped.yesterday.length > 0 && (
          <>
            <Text style={styles.dateGroupHeaderBold}>Yesterday</Text>
            {grouped.yesterday.map((tx) => (
              <View key={tx.id} style={styles.transactionItemContainer}>
                <View style={styles.transactionItemRow}>
                  <View style={styles.transactionInfoContainer}>
                    {tx.type === "restock" ? (
                      <PackagePlus
                        color={Colors.text}
                        strokeWidth={1.5}
                        size={36}
                      />
                    ) : (
                      <ShoppingBag
                        color={Colors.text}
                        strokeWidth={1.5}
                        size={36}
                      />
                    )}
                    <View>
                      <Text style={styles.transactionTitle}>
                        {tx.itemsCount} Items{" "}
                        {tx.type === "sale" ? "Sold" : "Restocked"}
                      </Text>
                      <Text style={styles.transactionTimestamp}>
                        {format(parseISO(tx.date), "p")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.userInfoContainer}>
                    <View style={styles.userAvatar}>
                      <Text style={styles.userAvatarText}>
                        {tx.userInitial}
                      </Text>
                    </View>
                    <Text style={styles.userNameText}>
                      By {tx.user.split(" ")[0]}
                    </Text>
                  </View>
                </View>
                <View style={styles.transactionDetailsRow}>
                  <View style={styles.categoryIconsContainer}>
                    {tx.categories.slice(0, 3).map((categoryName, index) => {
                      const category = categoryMap[categoryName];
                      return (
                        category && (
                          <View key={index} style={styles.categoryIconView}>
                            {category.icon(Colors.text)}
                          </View>
                        )
                      );
                    })}
                    {tx.categories.length > 3 && (
                      <View style={styles.categoryIconView}>
                        <Text style={styles.moreCategoriesText}>
                          +{tx.categories.length - 3}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.transactionAmountText}>
                    {tx.price}ETB
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}
        {Object.keys(grouped.earlier).map((date) => (
          <View key={date}>
            <Text style={styles.dateGroupHeaderBold}>{date}</Text>
            {grouped.earlier[date].map((tx) => (
              <View key={tx.id} style={styles.transactionItemContainer}>
                <View style={styles.transactionItemRow}>
                  <View style={styles.transactionInfoContainer}>
                    {tx.type === "restock" ? (
                      <PackagePlus
                        color={Colors.text}
                        strokeWidth={1.5}
                        size={36}
                      />
                    ) : (
                      <ShoppingBag
                        color={Colors.text}
                        strokeWidth={1.5}
                        size={36}
                      />
                    )}
                    <View>
                      <Text style={styles.transactionTitle}>
                        {tx.itemsCount} Items{" "}
                        {tx.type === "sale" ? "Sold" : "Restocked"}
                      </Text>
                      <Text style={styles.transactionTimestamp}>
                        {format(parseISO(tx.date), "p")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.userInfoContainer}>
                    <View style={styles.userAvatar}>
                      <Text style={styles.userAvatarText}>
                        {tx.userInitial}
                      </Text>
                    </View>
                    <Text style={styles.userNameText}>
                      By {tx.user.split(" ")[0]}
                    </Text>
                  </View>
                </View>
                <View style={styles.transactionDetailsRow}>
                  <View style={styles.categoryIconsContainer}>
                    {tx.categories.slice(0, 3).map((categoryName, index) => {
                      const category = categoryMap[categoryName];
                      return (
                        category && (
                          <View key={index} style={styles.categoryIconView}>
                            {category.icon(Colors.text)}
                          </View>
                        )
                      );
                    })}
                    {tx.categories.length > 3 && (
                      <View style={styles.categoryIconView}>
                        <Text style={styles.moreCategoriesText}>
                          +{tx.categories.length - 3}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.transactionAmountText}>
                    {tx.price}ETB
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
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
});

export default Transactions;
