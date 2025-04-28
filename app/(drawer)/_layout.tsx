import React, { useContext } from "react";
import { Drawer } from "expo-router/drawer";
import ProtectedRoute from "@/app/_middleware";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { Text, StyleSheet, Button, TouchableOpacity, View } from "react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { useTheme, ThemeProvider } from "@/context/ThemeContext";
import {
  FileUser,
  LogOut,
  Moon,
  Settings,
  Store,
  SunMedium,
} from "lucide-react-native";
import { AuthContext } from "@/context/AuthContext";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
  };
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
    >
      <View
        style={{
          paddingTop: 24,
          paddingBottom: 16,
          borderColor: Colors.secondary,
          borderBottomWidth: 0.5,
          width: "100%",
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            backgroundColor: Colors.accent,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 200,
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.outfit.bold,
              color: Colors.light,
              fontSize: 20,
            }}
          >
            {user.name[0]}
          </Text>
        </View>
        <Text
          style={{
            marginTop: 10,
            fontFamily: Fonts.outfit.medium,
            fontSize: 24,
            color: Colors.text,
          }}
        >
          {user.name}
        </Text>
      </View>
      <View style={styles.drawerOptionsContainer}>
        <TouchableOpacity style={styles.drawerOption} onPress={toggleTheme}>
          {theme === "light" ? (
            <>
              <Moon size={24} color={Colors.text} strokeWidth={1.5} />
              <Text style={[styles.drawerText, { color: Colors.text }]}>
                Dark Mode
              </Text>
            </>
          ) : (
            <>
              <SunMedium size={24} color={Colors.light} strokeWidth={1.5} />
              <Text style={[styles.drawerText, { color: Colors.light }]}>
                Light Mode
              </Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerOption}>
          <FileUser color={Colors.text} size={24} strokeWidth={1.5} />
          <Text style={styles.drawerText}>Staff Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerOption}>
          <Store color={Colors.text} size={24} strokeWidth={1.5} />
          <Text style={styles.drawerText}>Store Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerOption}>
          <Settings color={Colors.text} size={24} strokeWidth={1.5} />
          <Text style={styles.drawerText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerOption} onPress={handleLogout}>
          <LogOut color={Colors.text} size={24} strokeWidth={1.5} />
          <Text style={styles.drawerText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Text>version 1.0.0</Text>
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  const { theme } = useTheme();

  return (
    <ProtectedRoute>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={() => ({
          headerShown: false,
          swipeEnabled: false,
          drawerStyle: [
            styles.drawerStyle,
            { backgroundColor: theme === "light" ? Colors.light : Colors.dark },
          ],
          drawerType: "front",
        })}
      />
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  drawerStyle: {
    width: "75%",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  drawerContent: {
    flex: 1,
    padding: 0,
    justifyContent: "space-between",
    alignItems: "center",
  },
  drawerOptionsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 32,
    width: "100%",
  },
  drawerText: {
    fontFamily: Fonts.plusJakarta.regular,
    fontSize: 16,
  },
  drawerOption: { flexDirection: "row", gap: 8, alignItems: "center" },
});
