import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, Fonts } from "@/constants/Theme";
import { AuthContext } from "@/context/AuthContext";
import { requestShopAccess } from "@/api/notifications";
import SnackBar from "@/components/ui/Snackbar";

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

const EmployeeDetailsPage = () => {
  const router = useRouter();
  const { token } = useContext(AuthContext);
  const [shopId, setShopId] = useState("");
  const [isContinueEnabled, setIsContinueEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    setIsContinueEnabled(shopId.length > 0);
  }, [shopId]);

  const handleContinue = async () => {
    if (!shopId.trim()) {
      setNotification({
        message: "Please enter a shop ID",
        type: "error"
      });
      return;
    }

    setIsLoading(true);
    try {
      await requestShopAccess(shopId.trim(), token);
      // If successful, navigate to access denied page with shop ID
      router.push({
        pathname: "/(auth)/shopAccessDenied",
        params: { shopId: shopId.trim() }
      });
    } catch (error: any) {
      setNotification({
        message: error.response?.data?.error || "Invalid shop ID. Please try again.",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanQR = () => {
    // TODO: Implement QR code scanning logic
    console.log("Scan QR Code");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Let's find{'\n'} the shop work at</Text>
          <Text style={styles.label}>Shop ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter shop ID"
            value={shopId}
            onChangeText={setShopId}
            editable={!isLoading}
          />
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!isContinueEnabled || isLoading) && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isContinueEnabled || isLoading}
          >
            <Text style={styles.continueText}>
              {isLoading ? "Requesting..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {notification && (
        <SnackBar
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    fontSize: 16,
    fontFamily: Fonts.plusJakarta.medium,
    color: Colors.text,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
    marginBottom: 32,
  },
  label: {
    fontSize: 15,
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.text,
    marginBottom: 8,
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
  buttonsContainer: {
    gap: 16,
  },
  scanQRButton: {
    backgroundColor: Colors.light,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 48,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  scanQRText: {
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.text,
    fontSize: 17,
  },
  continueButton: {
    backgroundColor: Colors.accent,
    borderRadius: 48,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  continueText: {
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.light,
    fontSize: 17,
  },
  continueButtonDisabled: {
    backgroundColor: Colors.secondary,
    opacity: 0.7,
  },
});

export default EmployeeDetailsPage;