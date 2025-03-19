import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import TabBar from "@/components/TabBar";
import Header from "@/components/Header";

export default function TabLayout() {
  return (
    <>
      <Header />
      <Tabs tabBar={(props) => <TabBar {...props} />}>
        <Tabs.Screen
          name="index"
          options={{ title: "Dashboard", headerShown: false }}
        />
        <Tabs.Screen
          name="Inventory"
          options={{ title: "Inventory", headerShown: false }}
        />
        <Tabs.Screen
          name="Reports"
          options={{ title: "Reports", headerShown: false }}
        />
        <Tabs.Screen
          name="Transactions"
          options={{ title: "Transactions", headerShown: false }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({});
