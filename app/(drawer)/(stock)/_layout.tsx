import { Stack, router } from "expo-router";

export default function Stock() {
  return (
    <Stack>
      <Stack.Screen name="newProduct" options={{ headerShown: false }} />
      <Stack.Screen name="quickScan" options={{ headerShown: false }} />
      <Stack.Screen name="productDetails" options={{ headerShown: false }} />
    </Stack>
  );
}
