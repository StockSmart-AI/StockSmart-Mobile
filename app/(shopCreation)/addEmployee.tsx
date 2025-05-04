//@ts-nocheck
import React, { useState } from "react";
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
import { useShopCreation } from "@/context/ShopCreationContext";
import { Colors, Fonts } from "@/constants/Theme";
import { CircleMinus } from "lucide-react-native";

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
      <Text style={styles.title}>Add employees{"\n"}to your shop</Text>
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
          keyExtractor={(item) => item}
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
                  {item[0]}
                </Text>
              </View>
              <Text style={styles.employeeName}>{item}</Text>
              <TouchableOpacity onPress={() => removeEmployee(item)}>
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
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light, padding: 20 },
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
    flex: 1,
    flexShrink: 0,
    backgroundColor: Colors.light,
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
