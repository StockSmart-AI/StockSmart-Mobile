//@ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useShopCreation } from "@/context/ShopCreationContext";
import { CircleMinus } from "lucide-react-native";
import { Colors } from "@/constants/Theme";

const AddEmployeesScreen = () => {
  const router = useRouter();
  const { shopDetails, setShopDetails } = useShopCreation();
  const [email, setEmail] = useState("");

  const mockDatabase = [
    { email: "fanuelmaregu@gmail.com", name: "Fanuel Maregu" },
    { email: "samirahassen@gmail.com", name: "Samira Hassen" },
    { email: "teshomebalcha@gmail.com", name: "Teshome Balcha" },
  ];

  const addEmployee = () => {
    if (email.trim() === "") return;
    const employee = mockDatabase.find((emp) => emp.email === email) || {
      name: email,
      email,
    };

    if (!shopDetails.employees.includes(employee.email)) {
      setShopDetails((prev) => ({
        ...prev,
        employees: [...prev.employees, employee.email],
      }));
    }
    setEmail("");
  };

  const removeEmployee = (email: string) => {
    setShopDetails((prev) => ({
      ...prev,
      employees: prev.employees.filter((emp) => emp !== email),
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add your employees to the shop</Text>
      <Text style={styles.label}>Employees' email</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="e.g. example@gmail.com"
          placeholderTextColor="#A0A0A0"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity onPress={addEmployee}>
          <Ionicons name="arrow-forward" size={24} color="#6AC28A" />
        </TouchableOpacity>
      </View>

      <View style={styles.employeeList}>
        <Text style={styles.subTitle}>Invitees</Text>
        {shopDetails.employees.length === 0 && (
          <Text style={{ color: "#A0A0A0", marginTop: 20 }}>
            No employees added yet
          </Text>
        )}

        <FlatList
          data={shopDetails.employees}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.employeeCard}>
              <Text style={styles.employeeName}>{item}</Text>
              <TouchableOpacity onPress={() => removeEmployee(item)}>
                <CircleMinus color={Colors.secondary} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push("/grantRestock")}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "black" },
  label: { fontSize: 16, color: "black", marginTop: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF5F1",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  input: { flex: 1, fontSize: 16, color: "#000", padding: 10 },
  subTitle: { fontSize: 18, color: "black", marginTop: 10 },
  employeeList: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: Colors.light,
    borderRadius: 10,
    padding: 30,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  employeeCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  employeeName: { flex: 1, marginLeft: 10, fontSize: 16, color: "#000" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 80,
  },
  skipButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  skipText: { fontSize: 16, color: "black" },
  continueButton: {
    flex: 1,
    backgroundColor: "#6AC28A",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 10,
  },
  continueText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  disabledButton: { backgroundColor: "#B0C4B1" },
});

export default AddEmployeesScreen;
