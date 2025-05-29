import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Search, Plus } from "lucide-react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";

// Sample product data
const sampleProducts = [
  {
    id: "1",
    title: "Soda",
    units: 234,
    price: 2.00,
    category: "Processed Food",
    image: require("@/assets/images/chips.png"),
  },
  {
    id: "2",
    title: "Baby Shampoo",
    units: 45,
    price: 8.99,
    category: "Baby Products",
    image: require("@/assets/images/chips.png"),
  },
  {
    id: "3",
    title: "Face Cream",
    units: 78,
    price: 15.99,
    category: "Cosmetics",
    image: require("@/assets/images/chips.png"),
  },
  {
    id: "4",
    title: "Canned Beans",
    units: 120,
    price: 1.99,
    category: "Processed Food",
    image: require("@/assets/images/chips.png"),
  }
];

const categories = ["Baby Products", "Cosmetics", "Processed Food"];

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products] = useState(sampleProducts);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProductCard = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push({ pathname: "/(drawer)/(stock)/productDetails", params: { id: item.id } })}
      >
        <Image 
          source={item.image} 
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.infoRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.productUnits}>{item.units} Units</Text>
          </View>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={24} color={Colors.text} strokeWidth={1.5} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Products"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.activeCategoryChip,
            ]}
            onPress={() =>
              setSelectedCategory(
                selectedCategory === category ? null : category
              )
            }
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.activeCategoryText,
              ]}
            >
              {category}
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
        contentContainerStyle={[
          styles.productGrid,
          { paddingTop: 0, flexGrow: 0 }
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2B785117",
    borderColor: Colors.text,
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: Fonts.publicSans.regular,
  },
  categoriesContainer: {
    marginBottom: 4,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryChip: {
    width: 133,
    height: 32,
    minHeight: 28,
    gap: 4,
    borderRadius: 14,
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 8,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: Colors.text,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCategoryChip: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  categoryText: {
    fontFamily: Fonts.publicSans.medium,
    fontSize: 13,
    color: Colors.text,
  },
  activeCategoryText: {
    color: Colors.light,
  },
  productGrid: {
    paddingBottom: 16,
  },
  productCard: {
    width: 150,
    height: 273,
    minWidth: 160,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 0,
    overflow: "hidden",
    margin: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 0,
  },
  productImage: {
    width: "100%",
    height: 195,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: "transparent",
  },
  productTitle: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 18,
    color: "#222",
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
  },
  productUnits: {
    fontFamily: Fonts.publicSans.regular,
    fontSize: 13,
    color: "#1B2821",
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 0,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
    marginRight: 12,
    marginLeft: 12,
  },
  productPrice: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 18,
    color: Colors.accent,
    paddingTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
  },
});
