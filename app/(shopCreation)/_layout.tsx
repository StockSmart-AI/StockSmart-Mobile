import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { ShopCreationProvider } from "@/context/ShopCreationContext";
import { Colors, Fonts } from "@/constants/Theme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ShopCreationProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="shopName"
            options={{
              title: "Create Your Shop",
              headerStyle: {
                backgroundColor: Colors.light,
              },
              headerTitleAlign: "center",
              headerTitleStyle: {
                color: Colors.text,
                fontSize: 17,
                fontFamily: Fonts.plusJakarta.bold,
              },
              headerTintColor: Colors.accent,
              headerShadowVisible: false,
            }}
          />

          <Stack.Screen
            name="shopLocation"
            options={{
              title: "Create Your Shop",
              headerStyle: {
                backgroundColor: Colors.light,
              },
              headerTitleAlign: "center",
              headerTitleStyle: {
                color: Colors.text,
                fontSize: 17,
                fontFamily: Fonts.plusJakarta.bold,
              },
              headerTintColor: Colors.accent,
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="addEmployee"
            options={{
              title: "Create Your Shop",
              headerStyle: {
                backgroundColor: Colors.light,
              },
              headerTitleAlign: "center",
              headerTitleStyle: {
                color: Colors.text,
                fontSize: 17,
                fontFamily: Fonts.plusJakarta.bold,
              },
              headerTintColor: Colors.accent,
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="grantRestock"
            options={{
              title: "Create Your Shop",
              headerStyle: {
                backgroundColor: Colors.light,
              },
              headerTitleAlign: "center",
              headerTitleStyle: {
                color: Colors.text,
                fontSize: 17,
                fontFamily: Fonts.plusJakarta.bold,
              },
              headerTintColor: Colors.accent,
              headerShadowVisible: false,
            }}
          />

          <Stack.Screen
            name="sendInvitation"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="buildShop"
            options={{headerShown: false}}/>
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ShopCreationProvider>
  );
}
