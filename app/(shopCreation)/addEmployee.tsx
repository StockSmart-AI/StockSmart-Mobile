//@ts-nocheck
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useShopCreation, Employee } from "@/context/ShopCreationContext"; // Import Employee type
import { Colors, Fonts } from "@/constants/Theme";
import { CircleMinus } from "lucide-react-native";
import { getAllUsers, getUserByEmail } from "@/api/user"; // Import the API function
import { AuthContext } from "@/context/AuthContext"; // Import AuthContext
import SnackBar from "@/components/ui/Snackbar";

const AddEmployeesScreen = () => {
  const router = useRouter();
  const { shopDetails, setShopDetails } = useShopCreation();
  const [email, setEmail] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { token } = useContext(AuthContext);

  const addEmployee = async () => {
    if (email.trim() === "") return;
    Keyboard.dismiss();

    try {
      const response = await getUserByEmail(token, email.trim());
      
      if (response && response.data) {
        const userData = response.data;
        const employeeToAdd: Employee = {
          name: userData.name.split(' ')[0], // Get only the first name
          email: userData.email
        };

        if (!shopDetails.employees.find(
          (emp) => emp.email.toLowerCase() === employeeToAdd.email.toLowerCase()
        )) {
          setShopDetails((prev) => ({
            ...prev,
            employees: [...prev.employees, employeeToAdd],
          }));
          setEmail("");
        } else {
          setSnackbarMessage("Employee already added");
          setShowSnackbar(true);
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setSnackbarMessage("User not found check the email.");
      setShowSnackbar(true);
    }
  };

  const removeEmployee = (employeeEmail: string) => {
    setShopDetails((prev) => ({
      ...prev,
      employees: prev.employees.filter((emp) => emp.email !== employeeEmail),
      permissions: {
        ...prev.permissions,
        [employeeEmail]: undefined,
      },
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add employees{"\n"}to your shop</Text>
      <Text style={styles.label}>Employees' email</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="e.g. example@gmail.com"
          placeholderTextColor="#A0A0A0"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TouchableOpacity onPress={addEmployee}>
          <Ionicons name="arrow-forward" size={24} color="#6AC28A" />
        </TouchableOpacity>
      </View>

      <View style={styles.employeeList}>
        <Text style={styles.subTitle}>Invitees</Text>
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
            No employees added yet
          </Text>
        )}

        <FlatList
          data={shopDetails.employees}
          keyExtractor={(item) => item.email}
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
                  {item.name[0]?.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.employeeName}>{item.name}</Text>
              <TouchableOpacity onPress={() => removeEmployee(item.email)}>
                <CircleMinus
                  color={Colors.secondary}
                  size={24}
                  strokeWidth={1.5}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <KeyboardAvoidingView style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push("/buildShop")}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.continueButton,
            shopDetails.employees.length === 0 && styles.disabledButton,
          ]}
          disabled={shopDetails.employees.length === 0}
          onPress={() => router.push("/buildShop")}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {showSnackbar && (
        <SnackBar
          type="error"
          message={snackbarMessage}
          onClose={() => setShowSnackbar(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    padding: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
  },
  label: {
    fontSize: 20,
    fontFamily: Fonts.outfit.medium,
    color: Colors.text,
    marginTop: 48,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  input: { flex: 1, fontSize: 16, color: Colors.text, padding: 10 },
  subTitle: {
    fontSize: 20,
    fontFamily: Fonts.outfit.regular,
    color: Colors.text,
    marginTop: 10,
    marginBottom: 16,
  },
  employeeList: {
    flexShrink: 0,
    backgroundColor: Colors.light,
    minHeight: 200,
    height: "45%",
    borderRadius: 18,
    padding: 24,
    marginTop: 20,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  employeeCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  employeeName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    color: Colors.text,
    fontFamily: Fonts.outfit.regular,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 80,
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

export default AddEmployeesScreen;
