import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Search, Plus } from "lucide-react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { getAllProducts } from "@/api/stock";
import { AuthContext } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";

interface Product {
  id: string;
  name: string;
  shop_id: string;
  price: number;
  quantity: number;
  threshold: number;
  description: string;
  category: string;
  image_url: string;
}

const categories = ["Baby Products", "Cosmetics", "Processed Food"];

export default function Inventory() {
  const { token } = useContext(AuthContext);
  const { currentShop } = useShop();
  const { source } = useLocalSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setPage(1);
    setProducts([]);
    fetchProducts(1);
  }, [token, currentShop?.id]);

  useEffect(() => {
    if (page > 1 || isRefreshing) {
      fetchProducts(page);
    }
  }, [page, isRefreshing]);

  const fetchProducts = async (currentPage: number) => {
    if (!token || !currentShop?.id) {
      setIsLoading(false);
      setIsFetchingMore(false);
      setIsRefreshing(false);
      return;
    }

    if (currentPage === 1 && !isRefreshing) {
      setIsLoading(true);
    } else if (isRefreshing) {
      setIsRefreshing(true);
    } else {
      setIsFetchingMore(true);
    }
    setError(null);

    try {
      const response = await getAllProducts(token, currentShop.id, currentPage, 10);
      
      if (response && response.data) {
        setProducts(prevProducts => 
          currentPage === 1 
          ? response.data.products 
          : [...prevProducts, ...response.data.products]
        );
        setTotalPages(response.data.total_pages);
      } else {
        setProducts(currentPage === 1 ? [] : products);
        setError("Failed to load products: Unexpected response format.");
         console.error("Failed to load products: Unexpected response format", response);
      }
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      setProducts(currentPage === 1 ? [] : products);
       setError(`Failed to load products: ${err.message || "An error occurred"}`);
    } finally {
      if (currentPage === 1 && !isRefreshing) {
        setIsLoading(false);
      } else if (isRefreshing) {
        setIsRefreshing(false);
      } else {
        setIsFetchingMore(false);
      }
    }
  };

  const handleLoadMore = () => {
    if (!isFetchingMore && !isLoading && page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    if (!isLoading && !isFetchingMore) {
      setPage(1);
      setProducts([]);
      setIsRefreshing(true);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.category);
    return matchesSearch && matchesCategory;
  });

  const renderProductCard = ({ item }: { item: Product }) => {
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => {
          if (source === 'restock') {
            router.push({
              pathname: "/restock",
              params: { id: item.id }
            });
          } else {
            router.push({ 
              pathname: "/(drawer)/(stock)/productDetails", 
              params: { id: item.id } 
            });
          }
        }}
      >
        <Image 
          source={{ uri: item.image_url }} 
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.infoRow}>
          <View style={{flex: 1, marginRight: 4, gap: 8}}>
            <Text style={styles.productTitle} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.productUnits}>{item.quantity} Units</Text>
          </View>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color={Colors.accent} />
      </View>
    );
  };

  return (
  <View style={{flex: 1, backgroundColor: Colors.light}}>
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={24} color={Colors.text} strokeWidth={1.5} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Products"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

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
              selectedCategories.includes(category) && styles.activeCategoryChip,
            ]}
            onPress={() => {
              if (selectedCategories.includes(category)) {
                setSelectedCategories(selectedCategories.filter(cat => cat !== category));
              } else {
                setSelectedCategories([...selectedCategories, category]);
              }
            }}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategories.includes(category) && styles.activeCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.accent} style={{ flex: 1, justifyContent: 'center', paddingVertical: 24 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : filteredProducts.length === 0 ? (
         <Text style={styles.noProductsText}>No products found matching your criteria.</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          style={{width: '100%'}}
          contentContainerStyle={[
            styles.productGrid,
          ]}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.light,
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2B785117",
    borderColor: Colors.text,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: Fonts.publicSans.regular,
  },
  categoriesContainer: {
    paddingVertical: 10,
    marginBottom: 16,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryChip: {
    height: 40,
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary,
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
    fontSize: 14,
    color: Colors.text,
  },
  activeCategoryText: {
    color: Colors.light,
  },
  productGrid: {
    flexGrow: 1,
    rowGap: 8,
    columnGap: 8,
    paddingBottom: 200
  },
  productCard: {
    flexGrow: 1,
    maxWidth: '50%',
    height: 273,
    minWidth: 160,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 16,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    backgroundColor: "transparent",
  },
  productTitle: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 16,
    color: Colors.text,
  },
  productUnits: {
    fontFamily: Fonts.publicSans.regular,
    fontSize: 14,
    color: "#1B2821",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
  },
  productPrice: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 16,
    color: Colors.accent,
    paddingTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  errorText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
    fontFamily: Fonts.plusJakarta.regular,
  },
  noProductsText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Colors.secondary,
    fontFamily: Fonts.plusJakarta.regular,
  },
  footerLoading: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: Colors.primary,
  },
});

