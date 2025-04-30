import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { Colors, Fonts } from "@/constants/Theme";
import { AuthContext } from "@/context/AuthContext";

export default function ChooseRole() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"owner" | "employee" | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { firstName, surname, email, password } = useLocalSearchParams();
  const { signup } = useContext(AuthContext);

  const handleContinue = async () => {
    const name = firstName + " " + surname;
    if (selectedRole) {
      try {
        setLoading(true);
        await signup(name, email, password, selectedRole);
        router.push("/verification");
      } catch (error: any) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.subHeading}>Which {"\n"} role suits you?</Text>

        {/* Owner Card */}
        <TouchableOpacity
          style={[styles.card, selectedRole === "owner" && styles.selectedCard]}
          onPress={() => setSelectedRole("owner")}
        >
          <View style={styles.cardIcon}>
            <Image
              source={require("@/assets/images/shop.png")}
              style={styles.iconImage}
            />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Owner</Text>
            <Text style={styles.cardDescription}>
              Effortlessly manage your shop and grow your business with the best
              inventory tool.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Employee Card */}
        <TouchableOpacity
          style={[
            styles.card,
            selectedRole === "employee" && styles.selectedCard,
          ]}
          onPress={() => setSelectedRole("employee")}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Employee</Text>
            <Text style={styles.cardDescription}>
              Access your employers shop and make transactions with ease
            </Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/employee.png")}
              style={styles.iconImage}
            />
          </View>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedRole && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedRole}
        >
          <Text style={styles.continueButtonText}>
            {loading ? "Creating..." : "Create Account"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 64,
    paddingBottom: 32,
    backgroundColor: Colors.light,
  },
  subHeading: {
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
    fontSize: 32,
    marginBottom: 24,
  },
  card: {
    flexDirection: "row",
    backgroundColor: Colors.light,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 32,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 4,
  },
  iconImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  selectedCard: {
    shadowColor: "transparent",
    borderColor: Colors.accent,
    borderWidth: 2,
  },
  cardIcon: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.secondary,
  },
  continueButton: {
    backgroundColor: "#7ED1A7",
    borderRadius: 48,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: Colors.secondary,
    opacity: 0.8,
  },
  continueButtonText: {
    color: Colors.textWhite,
    fontSize: 17,
    fontFamily: Fonts.plusJakarta.regular,
  },
});
