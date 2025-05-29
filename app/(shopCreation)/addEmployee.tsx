//@ts-nocheck
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useShopCreation, Employee } from "@/context/ShopCreationContext"; // Import Employee type
import { Colors, Fonts } from "@/constants/Theme";
import { CircleMinus } from "lucide-react-native";
import { getAllUsers } from "@/api/user"; // Import the API function
import { AuthContext } from "@/context/AuthContext"; // Import AuthContext

const AddEmployeesScreen = () => {
  const router = useRouter();
  const { shopDetails, setShopDetails } = useShopCreation();
  const [email, setEmail] = useState("");
  const [allUsers, setAllUsers] = useState<Employee[]>([]); // Store fetched users
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { token } = useContext(AuthContext); // Get token from AuthContext

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setFetchError("Authentication token not found.");
        return;
      }
      setIsLoadingUsers(true);
      setFetchError(null);
      try {
        const response = await getAllUsers(token);
        if (response && response.data) {
          // Assuming response.data is an array of user objects { email, name, ... }
          const formattedUsers = response.data.map((user: any) => ({
            email: user.email,
            name: user.name,
          }));
          setAllUsers(formattedUsers);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setFetchError("Failed to load users. Please try again.");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [token]);

  const addEmployee = () => {
    if (email.trim() === "") return;
    // Find employee in the fetched list of users
    const existingEmployee = allUsers.find(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase()
    );

    const employeeToAdd: Employee = existingEmployee
      ? { name: existingEmployee.name, email: existingEmployee.email }
      : { name: email.trim(), email: email.trim() }; // If not found, use email as name

    if (
      !shopDetails.employees.find(
        (emp) => emp.email.toLowerCase() === employeeToAdd.email.toLowerCase()
      )
    ) {
      setShopDetails((prev) => ({
        ...prev,
        employees: [...prev.employees, employeeToAdd],
      }));
    }
    setEmail(""); // Clear input field
  };

  const removeEmployee = (employeeEmail: string) => {
    setShopDetails((prev) => ({
      ...prev,
      employees: prev.employees.filter((emp) => emp.email !== employeeEmail),
      // Also remove permissions for the removed employee
      permissions: {
        ...prev.permissions,
        [employeeEmail]: undefined, // Or delete prev.permissions[employeeEmail]
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
      {isLoadingUsers && <Text style={styles.loadingText}>Loading users...</Text>}
      {fetchError && <Text style={styles.errorText}>{fetchError}</Text>}

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
                  {/* Use first letter of name, or email if name is email */}
                  {(item.name === item.email
                    ? item.email[0]
                    : item.name[0]
                  )?.toUpperCase()}
                </Text>
              </View>
              {/* Display email in this list, or name if preferred */}
              <Text style={styles.employeeName}>{item.email}</Text>
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
          onPress={() => router.push("/grantRestock")} // Ensure skip also navigates correctly
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.continueButton,
            shopDetails.employees.length === 0 && styles.disabledButton,
          ]}
          disabled={shopDetails.employees.length === 0}
          onPress={() => router.push("/grantRestock")}
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
  loadingText: {
    textAlign: "center",
    marginTop: 10,
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.secondary,
  },
  errorText: {
    textAlign: "center",
    marginTop: 10,
    fontFamily: Fonts.plusJakarta.regular,
    color: "red",
  },
});

export default AddEmployeesScreen;
