import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { AuthContext } from "@/context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";

const Verification = () => {
  const [otp, setOtp] = useState("");
  const [canResend, setCanResend] = useState(false);
  const { verify, sendOtp } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { email } = useLocalSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanResend(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleVerify = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      await verify(otp, email);
      router.replace("/");
    } catch {
      Alert.alert("Error", "Invalid OTP");
      return;
    } finally {
      setLoading(false);
    }
    console.log("Entered OTP:", otp);
  };

  const handleResend = async () => {
    if (canResend) {
      await sendOtp(email);
      setCanResend(false);
      Alert.alert("Success", "OTP resent to your email");
      setTimeout(() => {
        setCanResend(true);
      }, 30000); // 30 seconds
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Verify Your {"\n"}Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          keyboardType="numeric"
          value={otp}
          onChangeText={setOtp}
        />
        <Text style={styles.subtitle}>
          We have sent an OTP verification code to your email address
        </Text>
      </View>
      <View>
        {canResend ? (
          <View style={styles.resend}>
            <Text style={styles.resendText}>Didn’t receive the OTP? </Text>
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResend}
            >
              <Text style={{ color: Colors.accent }}>Resend</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>
            {loading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 32,
    paddingTop: 64,
    backgroundColor: Colors.light,
  },
  title: {
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
    fontSize: 32,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.secondary,
    marginBottom: 20,
    textAlign: "center",
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
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.accent,
    justifyContent: "center",
    width: "100%",
    height: 50,
    borderRadius: 48,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.light,
    fontSize: 17,
  },
  resend: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  resendText: {
    alignItems: "center",
    justifyContent: "center",
    fontFamily: Fonts.plusJakarta.regular,
    fontSize: 13,
  },
  resendButton: {},
});

export default Verification;
