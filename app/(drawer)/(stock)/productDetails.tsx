import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Colors, Fonts } from "@/constants/Theme";

const sampleProducts = [
  {
    id: "1",
    title: "Soda",
    units: 234,
    price: 2.00,
    category: "Beverages",
    image: require("@/assets/images/chips.png"),
    description: "Soda: A timeless beverage known for its crisp, refreshing flavor and iconic carbonation.",
  },
  {
    id: "2",
    title: "Baby Shampoo",
    units: 45,
    price: 8.99,
    category: "Baby Products",
    image: require("@/assets/images/chips.png"),
    description: "Gentle shampoo for babies.",
  },
  {
    id: "3",
    title: "Face Cream",
    units: 78,
    price: 15.99,
    category: "Cosmetics",
    image: require("@/assets/images/chips.png"),
    description: "Moisturizing face cream.",
  },
  {
    id: "4",
    title: "Canned Beans",
    units: 120,
    price: 1.99,
    category: "Processed Food",
    image: require("@/assets/images/chips.png"),
    description: "Delicious canned beans.",
  }
];



export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const product = sampleProducts.find((p) => p.id === id);

  if (!product) return <Text style={{ padding: 32 }}>Product not found</Text>;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F6FAF8" }}>
      <View style={{ alignItems: "center", backgroundColor: "#E6F2EC", paddingVertical: 24 }}>
        <Image source={product.image} style={{ width: 180, height: 260, resizeMode: "contain" }} />
      </View>
      <View style={{ padding: 24 }}>
        <Text style={{ color: "#7C7C7C", fontFamily: Fonts.publicSans.regular, fontSize: 15, marginBottom: 4 }}>{product.category}</Text>
        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 4 }}>
          <View>
            <Text style={{ fontFamily: Fonts.publicSans.semiBold, fontSize: 24 }}>{product.title}</Text>
            <Text style={{ fontFamily: Fonts.publicSans.semiBold, fontSize: 15, color: "#1B2821" }}>{product.units} Units</Text>
          </View>
          <Text style={{ fontFamily: Fonts.publicSans.semiBold, fontSize: 24, color: Colors.accent }}>{product.price}ETB</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
          <TouchableOpacity style={{ flex: 1, borderWidth: 1, borderColor: Colors.text, borderRadius: 12, padding: 12, alignItems: "center" }}>
            <Text style={{ fontFamily: Fonts.publicSans.medium, fontSize: 16 }}>Restock Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, backgroundColor: Colors.accent, borderRadius: 12, padding: 12, alignItems: "center" }}>
            <Text style={{ fontFamily: Fonts.publicSans.medium, fontSize: 16, color: Colors.light }}>Sell Item</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ marginTop: 24, fontFamily: Fonts.publicSans.regular, fontSize: 15, color: Colors.secondary }}>{product.description}</Text>
        <TouchableOpacity style={{ marginTop: 8 }}>
          <Text style={{ color: Colors.accent, fontFamily: Fonts.publicSans.medium }}>View More</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 24, borderWidth: 1, borderColor: Colors.text, borderRadius: 24, padding: 16, alignItems: "center" }}>
          <Text style={{ fontFamily: Fonts.publicSans.medium, fontSize: 16 }}>Update Information</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 16, backgroundColor: "#F35B5B", borderRadius: 24, padding: 16, alignItems: "center" }}>
          <Text style={{ fontFamily: Fonts.publicSans.medium, fontSize: 16, color: Colors.light }}>Delete</Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 32, fontFamily: Fonts.publicSans.semiBold, fontSize: 18 }}>Statistics</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
          <View>
            <Text style={{ color: Colors.secondary, fontFamily: Fonts.publicSans.regular }}>Market Share</Text>
            <Text style={{ fontFamily: Fonts.publicSans.semiBold, fontSize: 16 }}>25%</Text>
          </View>
          <View>
            <Text style={{ color: Colors.secondary, fontFamily: Fonts.publicSans.regular }}>Remaining</Text>
            <Text style={{ fontFamily: Fonts.publicSans.semiBold, fontSize: 16 }}>50 units</Text>
          </View>
        </View>
        <Text style={{ marginTop: 32, fontFamily: Fonts.publicSans.semiBold, fontSize: 18 }}>Sales</Text>
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 12, marginTop: 12 }}>
          <Text style={{ fontFamily: Fonts.publicSans.medium, color: Colors.secondary }}>Daily</Text>
          <Text style={{ fontFamily: Fonts.publicSans.medium, color: Colors.secondary }}>Weekly</Text>
          <Text style={{ fontFamily: Fonts.publicSans.medium, color: Colors.secondary, backgroundColor: "#E6F2EC", borderRadius: 8, paddingHorizontal: 8 }}>Annual</Text>
          <Text style={{ fontFamily: Fonts.publicSans.medium, color: Colors.secondary }}>Monthly</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
          <View>
            <Text style={{ color: Colors.secondary, fontFamily: Fonts.publicSans.regular }}>Total Sales</Text>
            <Text style={{ fontFamily: Fonts.publicSans.semiBold, fontSize: 16 }}>1,500 units</Text>
          </View>
          <View>
            <Text style={{ color: Colors.secondary, fontFamily: Fonts.publicSans.regular }}>Revenue</Text>
            <Text style={{ fontFamily: Fonts.publicSans.semiBold, fontSize: 16 }}>21,000ETB</Text>
          </View>
        </View>
        <View style={{ backgroundColor: "#E6F2EC", borderRadius: 24, padding: 16, marginTop: 24 }}>
          <Text style={{ fontFamily: Fonts.publicSans.semiBold, fontSize: 16 }}>Growth Rate</Text>
          <Text style={{ fontFamily: Fonts.publicSans.medium, color: Colors.accent, marginBottom: 8 }}>+10%</Text>
          {/* Placeholder for graph */}
          <View style={{ height: 48, backgroundColor: "#D9EDE3", borderRadius: 12 }} />
        </View>
      </View>
    </ScrollView>
  );
}
