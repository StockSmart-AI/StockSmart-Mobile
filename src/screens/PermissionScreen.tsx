import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Switch } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Permission, PermissionType } from "../types/permissions";

const PermissionScreen = () => {
  const [permissions, setPermissions] = useState<Permission[]>([
    { type: PermissionType.Sales, enabled: true },
    { type: PermissionType.Inventory, enabled: false },
    { type: PermissionType.Restock, enabled: false }, // Add Restock permission
  ]);

  const togglePermission = (type: PermissionType) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.type === type
          ? { ...permission, enabled: !permission.enabled }
          : permission
      )
    );
  };

  const getIconName = (type: PermissionType) => {
    switch (type) {
      case PermissionType.Sales:
        return "point-of-sale";
      case PermissionType.Inventory:
        return "clipboard-list-outline";
      case PermissionType.Restock:
        return "package-variant-closed-plus"; // Icon for Restock
      default:
        return "help-circle-outline";
    }
  };

  const renderPermission = ({ item }: { item: Permission }) => (
    <View style={styles.permissionRow}>
      <MaterialCommunityIcons
        name={getIconName(item.type) as any}
        size={24}
        color="#4CAF50"
        style={styles.icon}
      />
      <Text style={styles.permissionText}>{item.type}</Text>
      <Switch
        value={item.enabled}
        onValueChange={() => togglePermission(item.type)}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={item.enabled ? "#4CAF50" : "#f4f3f4"}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Permissions</Text>
      <FlatList
        data={permissions}
        renderItem={renderPermission}
        keyExtractor={(item) => item.type}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5", // Light gray background
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Darker text for title
    marginBottom: 20,
    textAlign: "center",
  },
  list: {
    marginTop: 10,
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF", // White background for rows
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  icon: {
    marginRight: 15,
  },
  permissionText: {
    fontSize: 18,
    color: "#333", // Darker text for permission type
    flex: 1, // Ensure text takes available space
  },
});

export default PermissionScreen;
