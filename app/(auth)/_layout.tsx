import { Colors, Fonts } from "@/constants/Theme";
import { Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="createAccount" options={{ headerShown: false }} />
      <Stack.Screen
        name="chooseRole"
        options={{
          title: "Create Account",
          headerTitleStyle: {
            fontFamily: Fonts.plusJakarta.medium,
            fontSize: 17,
            color: Colors.text,
          },
          headerStyle: { backgroundColor: Colors.light },
          headerShadowVisible: false,
          headerBackImageSource: require("@/assets/icons/Left.png"),
          headerTintColor: Colors.accent,
        }}
      />
      <Stack.Screen
        name="verification"
        options={{
          title: "Verification",
          headerTitleStyle: {
            fontFamily: Fonts.plusJakarta.medium,
            fontSize: 17,
            color: Colors.text,
          },
          headerStyle: { backgroundColor: Colors.light },
          headerShadowVisible: false,
          headerBackImageSource: require("@/assets/icons/Left.png"),
          headerTintColor: Colors.accent,
        }}
      />
    </Stack>
  );
}
