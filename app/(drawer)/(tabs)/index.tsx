import ProtectedRoute from "@/components/ProtectedRoute";
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
import { PackagePlus, ShoppingCart, Milk } from "lucide-react-native";

export default function HomeScreen() {
  const { logout } = useContext(AuthContext);
  const { theme } = useTheme();
  const handleLogut = () => {
    logout();
  };

  return (
    <ProtectedRoute>
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonStyle}>
            <PackagePlus size={24} color={Colors.accent} strokeWidth={1.5} />
            <Text style={styles.buttonText}>Restock</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle}>
            <ShoppingCart size={24} color={Colors.accent} strokeWidth={1.5} />
            <Text style={styles.buttonText}>Sell</Text>
          </TouchableOpacity>
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
            <TouchableOpacity style={styles.categoryItem}>
              <Milk color={Colors.text} size={40} />
              <View style={{}}>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: Fonts.publicSans.medium,
                    color: Colors.text,
                    marginBottom: 4,
                  }}
                >
                  Dairy Product
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
            <TouchableOpacity style={styles.categoryItem}>
              <Milk color={Colors.text} size={40} />
              <View style={{}}>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: Fonts.publicSans.medium,
                    color: Colors.text,
                    marginBottom: 4,
                  }}
                >
                  Dairy Product
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
            <TouchableOpacity style={styles.categoryItem}>
              <Milk color={Colors.text} size={40} />
              <View style={{}}>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: Fonts.publicSans.medium,
                    color: Colors.text,
                    marginBottom: 4,
                  }}
                >
                  Dairy Product
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
          </View>
        </View>
      </ScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    paddingBottom: 72,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingVertical: 20,
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
    alignItems: "flex-start",
    alignContent: "flex-start",
    rowGap: 16,
    columnGap: 20,
    flexWrap: "wrap",
    paddingVertical: 20,
  },
  categoryItem: {
    minWidth: 160,
    height: 155,
    boxShadow: "0px 2px 7px 0px rgba(0, 0, 0, 0.08)",
    borderRadius: 18,
    padding: 20,
    justifyContent: "space-between",
  },
});
