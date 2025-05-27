import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { Plus, Baby, ShoppingBag, Soup, Sparkles } from "lucide-react-native";
import { Colors, Fonts } from "@/constants/Theme";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  units: number;
  image: string;
}

const categories = [
  { key: "Baby Products", label: "Baby Products", icon: <Baby size={16} color="#fff" /> },
  { key: "Cosmetics", label: "Cosmetics", icon: <Sparkles size={16} color="#fff" /> },
  { key: "Processed Food", label: "Processed Food", icon: <Soup size={16} color="#fff" /> },
];

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Chips",
    category: "Processed Food",
    price: 2.0,
    units: 234,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "2",
    name: "Soda",
    category: "Processed Food",
    price: 2.0,
    units: 234,
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "3",
    name: "Cosmetic Cream",
    category: "Cosmetics",
    price: 2.0,
    units: 234,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "4",
    name: "Noodles",
    category: "Processed Food",
    price: 2.0,
    units: 234,
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "5",
    name: "Baby Lotion",
    category: "Baby Products",
    price: 2.0,
    units: 234,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "6",
    name: "Energy Drink",
    category: "Processed Food",
    price: 2.0,
    units: 234,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  },
];

const ProductListing = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = mockProducts.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardName}>{item.name}</Text>
      <Text style={styles.cardUnits}>{item.units} Units</Text>
      <View style={styles.cardBottomRow}>
        <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity style={styles.plusButton}>
          <Plus size={22} color="#222" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarWrapper}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Products"
          placeholderTextColor="#A0A0A0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 4 }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.chip,
              selectedCategory === cat.key && styles.chipSelected,
            ]}
            onPress={() => setSelectedCategory(selectedCategory === cat.key ? null : cat.key)}
            activeOpacity={0.8}
          >
            {cat.icon}
            <Text
              style={[
                styles.chipText,
                selectedCategory === cat.key && styles.chipTextSelected,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingTop: 16,
  },
  searchBarWrapper: {
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  searchBar: {
    backgroundColor: "#F2F7F4",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    color: "#222",
  },
  chipScroll: {
    marginBottom: 8,
    minHeight: 44,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#222",
  },
  chipSelected: {
    backgroundColor: "#7ED1A7",
    borderColor: "#7ED1A7",
  },
  chipText: {
    color: "#fff",
    fontSize: 15,
    marginLeft: 6,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "#222",
  },
  grid: {
    paddingHorizontal: CARD_MARGIN,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#181818",
    borderRadius: 18,
    marginBottom: CARD_MARGIN,
    marginHorizontal: CARD_MARGIN / 2,
    width: CARD_WIDTH,
    padding: 0,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: CARD_WIDTH,
    resizeMode: "cover",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  cardName: {
    color: "#444",
    fontSize: 17,
    fontWeight: "600",
    marginTop: 10,
    marginLeft: 12,
  },
  cardUnits: {
    color: "#888",
    fontSize: 13,
    marginLeft: 12,
    marginBottom: 2,
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 10,
    marginHorizontal: 12,
  },
  cardPrice: {
    color: "#7ED1A7",
    fontSize: 18,
    fontWeight: "bold",
  },
  plusButton: {
    backgroundColor: "#fff",
    borderRadius: 100,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
});

export default ProductListing;
