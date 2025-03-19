import React from "react";
import { Drawer } from "expo-router/drawer";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Theme";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView {...props}>
      <Text>Hello</Text>
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: styles.drawerStyle,
        drawerType: "front",
      }}
    />
  );
}

const styles = StyleSheet.create({
  drawerStyle: {
    backgroundColor: Colors.light.background,
    width: "80%",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
});
