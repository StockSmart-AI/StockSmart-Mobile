import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/AuthContext";
import { Colors, Fonts } from "@/constants/Theme";
import { Eye, EyeOff } from "lucide-react-native";
import { forgotPassword } from "@/api/auth";
import { ShopContext } from "@/context/ShopContext";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const shopContext = useContext(ShopContext);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      
      if (!user.isVerified) {
        router.push("/(auth)/verification");
        return;
      }

      // Check if user is an employee and has no shop
      if (user.role === 'employee' && !user.shop) {
        router.push("/(auth)/employeeDetails");
        return;
      }

      // Default navigation for other cases
      router.push("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      Alert.alert(
        "Success",
        "If an account with this email exists, a password reset link has been sent.",
        [{ text: "OK" }]
      );
    } catch (error: any) {
      // Even if there's an error, we show the same message for security
      Alert.alert(
        "Success",
        "If an account with this email exists, a password reset link has been sent.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View>
          <Text style={styles.txt}>Sign In to{"\n"}Your Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={24} color={Colors.secondary} strokeWidth={1.5} />
              ) : (
                <Eye size={24} color={Colors.secondary} strokeWidth={1.5}/>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
            <Text style={[styles.forgotPasswordText, loading && styles.disabledText]}>
              Forgot Password
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container2}>
          <TouchableOpacity
            style={[styles.btn, loading && styles.disabledBtn]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.createAccountBtn]}
            onPress={() => router.push("/createAccount")}
            disabled={loading}
          >
            <Text style={[styles.btnText, styles.createAccountBtnText]}>
              Create Account
            </Text>
          </TouchableOpacity>
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
    backgroundColor: Colors.light,
    padding: 16,
    paddingBottom: 32,
    paddingTop: 64,
  },
  input: {
    width: "100%",
    minHeight: 56,
    borderRadius: 16,
    fontFamily: Fonts.plusJakarta.regular,
    fontSize: 15,
    color: Colors.secondary,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  txt: {
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
    fontSize: 32,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.secondary,
    fontSize: 15,
    marginBottom: 16,
    paddingLeft: 12,
  },
  container2: {
    gap: 16,
  },
  btn: {
    backgroundColor: Colors.accent,
    justifyContent: "center",
    width: "100%",
    height: 50,
    borderRadius: 48,
    alignItems: "center",
  },
  createAccountBtn: {
    backgroundColor: Colors.light,
    borderWidth: 1,
    borderColor: Colors.text,
  },
  btnText: {
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.light,
    fontSize: 17,
  },
  createAccountBtnText: {
    color: Colors.text,
  },
  disabledBtn: {
    opacity: 0.7,
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
  disabledText: {
    opacity: 0.5,
  },
});
