import React, { useState, useEffect, useRef, useMemo } from "react";
import Svg, { Path } from "react-native-svg";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { ArrowLeft, Search } from "lucide-react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { router } from "expo-router";
import Cart from "@/components/Cart";
import Scanner from "@/components/Scanner";

export default function Sell() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={32} color={Colors.accent} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={{ fontFamily: Fonts.outfit.medium, fontSize: 20 }}>
          Sell Product
        </Text>
        <ArrowLeft size={32} color={"transparent"} strokeWidth={1.5} />
      </View>

      <Scanner />

      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          padding: 24,
          paddingBottom: 120,
        }}
      >
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            borderWidth: 1,
            borderColor: Colors.text,
            paddingVertical: 16,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Search color={Colors.text} strokeWidth={1.5} size={24} />
          <Text style={{ fontFamily: Fonts.publicSans.regular, fontSize: 18 }}>
            Search
          </Text>
        </TouchableOpacity>
      </View>
      <Cart />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light,
    gap: 24,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
