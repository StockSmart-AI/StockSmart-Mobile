import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Touchable,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Colors, Fonts } from "@/constants/Theme";
import HeroCard from "@/components/HeroCard";
import {
  PackagePlus,
  ShoppingCart,
  Milk,
  SquarePlus,
  SquareMinus,
  ScanBarcode,
  Boxes,
} from "lucide-react-native";
import {
  bottleChampagne,
  jar,
  bottleBaby,
  bottleDispenser,
  bottlePerfume,
} from "@lucide/lab";
import { Icon } from "lucide-react-native";
import { router } from "expo-router";
import SnackBar from "@/components/ui/Snackbar";
import { getSummaryCards } from "@/api/analytics";
import { useShop } from "@/context/ShopContext";

const categories = [
  {
    name: "Dairy",
    icon: <Milk color={Colors.text} size={36} strokeWidth={1.5} />,
  },
  {
    name: "Beverage",
    icon: (
      <Icon
        iconNode={bottleChampagne}
        color={Colors.text}
        size={36}
        strokeWidth={1.5}
      />
    ),
  },
  {
    name: "Processed Food",
    icon: (
      <Icon iconNode={jar} color={Colors.text} size={36} strokeWidth={1.5} />
    ),
  },
  {
    name: "Baby Products",
    icon: (
      <Icon
        iconNode={bottleBaby}
        color={Colors.text}
        size={36}
        strokeWidth={1.5}
      />
    ),
  },
  {
    name: "Cleaning Agents",
    icon: (
      <Icon
        iconNode={bottleDispenser}
        color={Colors.text}
        size={36}
        strokeWidth={1.5}
      />
    ),
  },
  {
    name: "Cosmetics",
    icon: <Boxes color={Colors.text} size={36} strokeWidth={1.5} />,
  },
];

const SkeletonButton = () => (
  <View style={[styles.buttonStyle, { backgroundColor: Colors.primary }]} />
);

const SkeletonCategory = () => (
  <View style={[styles.categoryItem, { backgroundColor: Colors.primary }]} />
);

export default function HomeScreen() {
  const { logout, user } = useContext(AuthContext);
  const { theme } = useTheme();
  const { token } = useContext(AuthContext);
  const { currentShop } = useShop();
  const [inventoryValue, setInventoryValue] = useState<string>("0.00");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchInventoryValue = async () => {
    if (!token || !currentShop) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getSummaryCards(token, currentShop.id);
      const summaryData = response.data;
      
      // Find the stock value card (it's the last item in the array)
      const stockValueCard = summaryData[3]; // "Stock Value (ETB)"
      if (stockValueCard) {
        setInventoryValue(stockValueCard.value);
      }
    } catch (err) {
      console.error("Error fetching inventory value:", err);
      setError("Failed to load inventory value");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryValue();
  }, [token, currentShop]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchInventoryValue();
    setIsRefreshing(false);
  };

  const handleLogut = () => {
    logout();
  };

  const isEmployee = user?.role === 'employee';

  return (
    <ScrollView
      contentContainerStyle={[
        styles.page,
        {
          flexGrow: 1,
          backgroundColor: theme === "light" ? Colors.light : Colors.dark,
        },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[Colors.accent]}
          tintColor={Colors.accent}
          progressViewOffset={20}
        />
      }
    >
      <HeroCard 
        inventoryValue={inventoryValue}
        isLoading={isLoading || isRefreshing}
        error={error}
      />
      
      {/* Action Buttons */}
      <View style={{ paddingVertical: 20, gap: 20 }}>
        {isLoading || isRefreshing ? (
          <>
            <View style={[styles.buttonStyle, { borderRadius: 100, backgroundColor: Colors.primary }]} />
            {!isEmployee && (
              <View style={styles.buttonContainer}>
                <SkeletonButton />
                <SkeletonButton />
              </View>
            )}
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.buttonStyle,
                { borderRadius: 100, borderColor: Colors.text },
              ]}
              onPress={() => router.replace("/quickScan")}
            >
              <ScanBarcode size={24} color={Colors.text} strokeWidth={1.5} />
              <Text style={[styles.buttonText, { color: Colors.text }]}>
                Quick Scan
              </Text>
            </TouchableOpacity>
            {!isEmployee && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={() => router.replace("/(drawer)/(stock)/newProduct")}
                >
                  <SquarePlus size={24} color={Colors.accent} strokeWidth={1.5} />
                  <Text style={styles.buttonText}>New Product</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.buttonStyle} 
                  onPress={() => router.replace("/(drawer)/(stock)/deleteItem")}
                >
                  <SquareMinus size={24} color={Colors.accent} strokeWidth={1.5} />
                  <Text style={styles.buttonText}>Delete Item</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>

      {/* Categories Section */}
      <View style={styles.categorySection}>
        {isLoading || isRefreshing ? (
          <>
            <View style={{ width: '40%', height: 24, backgroundColor: Colors.primary, borderRadius: 4 }} />
            <View style={styles.categoryContainer}>
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <SkeletonCategory key={index} />
              ))}
            </View>
          </>
        ) : (
          <>
            <Text
              style={{
                fontSize: 20,
                fontFamily: Fonts.publicSans.semiBold,
                textAlign: "left",
              }}
            >
              Categories
            </Text>
            <View style={styles.categoryContainer}>
              {categories.map((category, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.categoryItem}
                  onPress={() => router.push({
                    pathname: "/(drawer)/(tabs)/Inventory",
                    params: { selectedCategory: category.name }
                  })}
                >
                  {category.icon}
                  <View>
                    <Text
                      style={{
                        fontSize: 17,
                        fontFamily: Fonts.publicSans.medium,
                        color: Colors.text,
                        marginBottom: 4,
                      }}
                    >
                      {category.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: Fonts.publicSans.regular,
                        color: Colors.secondary,
                      }}
                    >
                      $50,000
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    paddingBottom: 72,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  buttonStyle: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderColor: Colors.accent,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
  },
  buttonText: {
    fontSize: 17,
    color: Colors.accent,
  },
  categorySection: {
    justifyContent: "flex-start",
    width: "100%",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 20,
  },
  categoryItem: {
    width: "47%",
    height: 155,
    borderRadius: 18,
    padding: 20,
    justifyContent: "space-between",
    backgroundColor: Colors.light,
    shadowColor: "#4F5652",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 4,
  },
});
