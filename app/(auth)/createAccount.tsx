import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import React from "react";
import { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { Fonts, Colors } from "@/constants/Theme";
import { AuthContext } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react-native";

export default function CreateAccount() {
  const router = useRouter();
  const { theme } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleContinue = () => {
    if (!firstName || !surname || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    router.push({
      pathname: "/chooseRole",
      params: {
        firstName,
        surname,
        email,
        password,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.container,
          { backgroundColor: theme === "dark" ? Colors.dark : Colors.light },
        ]}
      >
        <View>
          <Text
            style={[
              styles.txt,
              { color: theme === "dark" ? Colors.textWhite : Colors.text },
            ]}
          >
            Create{"\n"}Your Account
          </Text>
          <View style={styles.horizontalContainer}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Surname"
              value={surname}
              onChangeText={setSurname}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={24} color={Colors.secondary} strokeWidth={1.5} />
              ) : (
                <Eye size={24} color={Colors.secondary} strokeWidth={1.5} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={24} color={Colors.secondary} strokeWidth={1.5} />
              ) : (
                <Eye size={24} color={Colors.secondary} strokeWidth={1.5} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ justifyContent: "center" }}>
          <Text style={styles.txt1}>
            By signing up, you agree to our terms and conditions.
          </Text>
          <View style={{ gap: 16 }}>
            <TouchableOpacity style={styles.btn} onPress={handleContinue}>
              <Text style={styles.btnText}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.loginBtn]}
              onPress={() => router.push("/login")}
            >
              <Text style={[styles.btnText, styles.loginBtnText]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 32,
    paddingTop: 64,
  },
  txt: {
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
    fontSize: 32,
    marginBottom: 24,
  },
  horizontalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    width: "100%",
    minHeight: 56,
    borderRadius: 16,
    paddingHorizontal: 12,
    fontFamily: Fonts.plusJakarta.regular,
    fontSize: 15,
    color: Colors.secondary,
    backgroundColor: Colors.primary,
    borderWidth: 0,
    marginBottom: 16,
  },
  halfInput: {
    width: "48%",
  },
  txt1: {
    fontFamily: Fonts.plusJakarta.light,
    fontSize: 13,
    textAlign: "center",
    color: Colors.secondary,
    marginBottom: 8,
  },
  btn: {
    backgroundColor: Colors.accent,
    justifyContent: "center",
    width: "100%",
    height: 50,
    borderRadius: 48,
    alignItems: "center",
  },
  btnText: {
    fontFamily: Fonts.publicSans.medium,
    color: Colors.textWhite,
    fontSize: 17,
  },
  loginBtn: {
    backgroundColor: Colors.light,
    borderWidth: 1,
    borderColor: Colors.text,
  },
  loginBtnText: {
    color: Colors.text,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  passwordInput: {
    paddingRight: 50, // Make room for the eye icon
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
});
