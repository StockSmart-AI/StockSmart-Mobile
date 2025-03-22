import React from "react";
import { Drawer } from "expo-router/drawer";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Theme";
import { useTheme, ThemeProvider } from "@/context/ThemeContext";
import { Moon, SunMedium } from "lucide-react-native";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <DrawerContentScrollView {...props}>
      <TouchableOpacity
        style={{ flexDirection: "row", gap: 5 }}
        onPress={toggleTheme}
      >
        {theme === "light" ? (
          <>
            <Moon size={24} color={Colors.text} />
            <Text style={{ color: Colors.text }}>Dark Mode</Text>
          </>
        ) : (
          <>
            <SunMedium size={24} color={Colors.light} />
            <Text style={{ color: Colors.light }}>Light Mode</Text>
          </>
        )}
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  const { theme } = useTheme();
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={() => ({
        headerShown: false,
        drawerStyle: [
          styles.drawerStyle,
          { backgroundColor: theme === "light" ? Colors.light : Colors.dark },
        ],
        drawerType: "front",
      })}
    />
  );
}

const styles = StyleSheet.create({
  drawerStyle: {
    width: "80%",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
});
