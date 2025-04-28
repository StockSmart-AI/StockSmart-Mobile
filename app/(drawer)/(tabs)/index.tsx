import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Colors, Fonts } from "@/constants/Theme";
import { ScrollView } from "react-native-gesture-handler";
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

export default function HomeScreen() {
  const { logout } = useContext(AuthContext);
  const { theme } = useTheme();
  const handleLogut = () => {
    logout();
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.page,
          {
            flexGrow: 1,
            backgroundColor: theme === "light" ? Colors.light : Colors.dark,
          },
        ]}
      >
        <HeroCard />

        {/* Action Buttons */}
        <View style={{ paddingVertical: 20, gap: 20 }}>
          <TouchableOpacity
            style={[
              styles.buttonStyle,
              { borderRadius: 100, borderColor: Colors.text },
            ]}
          >
            <ScanBarcode size={24} color={Colors.text} strokeWidth={1.5} />
            <Text style={[styles.buttonText, { color: Colors.text }]}>
              Quick Scan
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => router.push("/(drawer)/(stock)/newProduct")}
            >
              <SquarePlus size={24} color={Colors.accent} strokeWidth={1.5} />
              <Text style={styles.buttonText}>New Item</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle}>
              <SquareMinus size={24} color={Colors.accent} strokeWidth={1.5} />
              <Text style={styles.buttonText}>Delete Item</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.categorySection}>
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
              <TouchableOpacity key={index} style={styles.categoryItem}>
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
        </View>
      </ScrollView>
    </>
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
