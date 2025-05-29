import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ArrowLeft, AlertTriangle, LineChart, ClipboardList } from "lucide-react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { router } from "expo-router";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontFamily: Fonts.outfit.semiBold,
    fontSize: 18,
    color: Colors.text,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  title: {
    fontFamily: Fonts.outfit.semiBold,
    fontSize: 16,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: Fonts.plusJakarta.regular,
    fontSize: 13,
    color: Colors.tertiary,
    marginTop: 2,
  },
  date: {
    fontFamily: Fonts.plusJakarta.regular,
    fontSize: 13,
    color: Colors.tertiary,
    marginLeft: 8,
  },
  grantBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingHorizontal: 25,
    paddingVertical: 8,
  },
  grantText: {
    color: Colors.light,
    fontFamily: Fonts.plusJakarta.medium,
    fontSize: 15,
  },
  denyBtn: {
    backgroundColor: "#F35B5B",
    borderRadius: 16,
    paddingHorizontal: 25,
    paddingVertical: 8,
  },
  denyText: {
    color: Colors.light,
    fontFamily: Fonts.plusJakarta.medium,
    fontSize: 15,
  },
});

const notifications = [
  {
    id: 1,
    icon: <AlertTriangle color={Colors.text} size={28} strokeWidth={1.5} />,
    title: "Restock Product A",
    subtitle: "Low Inventory",
    date: "Oct 12, 2021",
    actions: null,
  },
  {
    id: 2,
    icon: <LineChart color={Colors.text} size={28} strokeWidth={1.5} />,
    title: "Restock Product B",
    subtitle: "Predicted to Grow",
    date: "Oct 12, 2021",
    actions: null,
  },
  {
    id: 3,
    icon: <AlertTriangle color={Colors.text} size={28} strokeWidth={1.5} />,
    title: "Restock Product D",
    subtitle: "Low Inventory",
    date: "Oct 12, 2021",
    actions: null,
  },
  {
    id: 4,
    icon: <ClipboardList color={Colors.text} size={28} strokeWidth={1.5} />,
    title: "Yasin is requesting Access",
    subtitle: "permit or deny access",
    date: "Oct 12, 2021",
    actions: (
      <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
        <TouchableOpacity style={styles.grantBtn}>
          <Text style={styles.grantText}>Grant</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.denyBtn}>
          <Text style={styles.denyText}>Deny</Text>
        </TouchableOpacity>
      </View>
    ),
  },
];

export default function NotificationPage() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={Colors.accent} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 28 }} /> {/* Spacer */}
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {notifications.map((n) => (
          <View key={n.id} style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {n.icon}
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.title}>{n.title}</Text>
                <Text style={styles.subtitle}>{n.subtitle}</Text>
              </View>
              <Text style={styles.date}>{n.date}</Text>
            </View>
            {n.actions}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
