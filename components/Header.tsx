import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Bell, ChevronDown, Menu } from "lucide-react-native";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Colors, Fonts } from "@/constants/Theme";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: theme === "light" ? Colors.light : Colors.dark },
      ]}
    >
      <DrawerToggleButton tintColor={Colors.accent} />
      <TouchableOpacity style={styles.shopToggle}>
        <Text
          style={[
            styles.shopLabel,
            { color: theme === "light" ? Colors.text : Colors.textWhite },
          ]}
        >
          Shop-Merkato
        </Text>
        <ChevronDown size={24} color={Colors.accent} />
      </TouchableOpacity>
      <Bell size={20} color={Colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },

  shopLabel: {
    fontSize: 17,
    fontFamily: Fonts.publicSans.semiBold,
  },

  shopToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
