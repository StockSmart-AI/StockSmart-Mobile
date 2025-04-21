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
import { router } from "expo-router";

const Verification = () => {
  const [otp, setOtp] = useState("");
  const { verify, sendOtp, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [waitTime, setWaitTime] = useState(30);
  const [counter, setCounter] = useState(waitTime);
  const [isCounting, setisCounting] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isCounting && counter > 0) {
      timer = setTimeout(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
    } else if (counter === 0) {
      setisCounting(false);
    }

    return () => clearTimeout(timer);
  }, [counter, isCounting]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  //verification handler
  const handleVerify = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      await verify(otp, user.email);
      router.replace("/");
    } catch {
      Alert.alert("Error", "Invalid OTP");
      return;
    } finally {
      setLoading(false);
    }
    console.log("Entered OTP:", otp);
  };

  // Resend handler
  const handleResend = async () => {
    await sendOtp(user.email);
    Alert.alert("Success", "OTP resent to your email");
    setWaitTime((prev) => prev * 2);
    setCounter(waitTime);
    setisCounting(true);
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
        <View style={styles.resend}>
          <Text style={styles.resendText}>Didn’t receive the OTP? </Text>

          {!isCounting ? (
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResend}
            >
              <Text style={{ color: Colors.accent }}>Resend</Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text style={styles.resendText}>
                Resend in {formatTime(counter)}
              </Text>
            </>
          )}
        </View>
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
    gap: 2,
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
