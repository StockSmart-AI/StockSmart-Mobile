//@ts-nocheck
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useShopCreation } from "@/context/ShopCreationContext";
import { Colors, Fonts } from "@/constants/Theme";

const GrantRestockScreen = () => {
  const router = useRouter();
  const { shopDetails, setShopDetails } = useShopCreation();

  const toggleRestockPermission = (employeeEmail: string) => {
    setShopDetails((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [employeeEmail]: !prev.permissions[employeeEmail], // Toggle permission
      },
    }));
  };

  const getFirstName = (name: string, email: string) => {
    if (name && name !== email) {
      return name.split(" ")[0];
    }
    return email.split("@")[0];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who has {`\n`}restock access</Text>
      <Text style={styles.label}>
        Choose employees who can manage restock requests.
      </Text>

      <View style={styles.employeeList}>
        <Text style={styles.subTitle}>Employees</Text>
        {shopDetails.employees.length === 0 && (
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.plusJakarta.regular,
              color: Colors.secondary,
              marginTop: 20,
              alignSelf: "center",
            }}
          >
            No employees added yet. Go back to add employees.
          </Text>
        )}

        <FlatList
          data={shopDetails.employees}
          keyExtractor={(item) => item.email} // Use email as key
          renderItem={({ item }) => (
            <View style={styles.employeeCard}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: Colors.accent,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.outfit.semiBold,
                    fontSize: 16,
                    color: Colors.light,
                  }}
                >
                  {(item.name === item.email
                    ? item.email[0]
                    : item.name[0]
                  )?.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.employeeName}>
                {getFirstName(item.name, item.email)}
              </Text>
              <TouchableOpacity
                onPress={() => toggleRestockPermission(item.email)}
                style={[
                  styles.permissionButton,
                  shopDetails.permissions[item.email]
                    ? styles.permissionGranted
                    : styles.permissionRevoked,
                ]}
              >
                <Text style={styles.permissionButtonText}>
                  {shopDetails.permissions[item.email] ? "Revoke" : "Grant"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <KeyboardAvoidingView style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push("/shopSummary")} // Update navigation target
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.continueButton,
            shopDetails.employees.length === 0 && styles.disabledButton,
          ]}
          disabled={shopDetails.employees.length === 0}
          onPress={() => router.push("/shopSummary")} // Update navigation target
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    padding: 20,
    // Removed justifyContent: "space-between" to allow natural flow if content is less
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
    marginBottom: 10, // Added margin for spacing
  },
  label: {
    fontSize: 16, // Adjusted size
    fontFamily: Fonts.outfit.regular, // Adjusted font
    color: Colors.textSecondary, // Adjusted color
    marginBottom: 20, // Added margin
  },
  // Remove inputContainer and input styles as they are no longer used
  subTitle: {
    fontSize: 20,
    fontFamily: Fonts.outfit.medium, // Adjusted font
    color: Colors.text,
    // marginTop: 10, // Adjusted from original
    marginBottom: 16,
  },
  employeeList: {
    flex: 1, // Allow list to take available space
    backgroundColor: Colors.light,
    // height: "45%", // Removed fixed height, let it be flexible
    borderRadius: 18,
    padding: 24,
    marginTop: 10, // Adjusted margin
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  employeeCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12, // Increased padding
    borderBottomWidth: 1, // Add separator
    borderBottomColor: Colors.primary,
  },
  employeeName: {
    flex: 1,
    marginLeft: 12, // Increased margin
    fontSize: 16, // Adjusted size
    color: Colors.text,
    fontFamily: Fonts.outfit.regular,
  },
  permissionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  permissionGranted: {
    backgroundColor: Colors.secondary, // Example: Red for revoke
  },
  permissionRevoked: {
    backgroundColor: Colors.accent, // Example: Green for grant
  },
  permissionButtonText: {
    color: Colors.light,
    fontSize: 14,
    fontFamily: Fonts.outfit.medium,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20, // Adjusted margin
    paddingVertical: 10, // Add padding for buttons at the bottom
  },
  skipButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  skipText: { fontSize: 16, color: Colors.text },
  continueButton: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 10,
  },
  continueText: { fontSize: 16, color: Colors.light, fontWeight: "bold" },
  disabledButton: { backgroundColor: Colors.secondary },
});

export default GrantRestockScreen;
