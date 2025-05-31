import { useLocalSearchParams, router } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { useState, useEffect, useContext } from "react";
import { getProductById } from "@/api/stock";
import { AuthContext } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react-native";
import SkeletonContent from "react-native-skeleton-content";


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

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id || !token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await getProductById(token, id as string);
        if (response && response.data && response.data.product) {
          setProduct(response.data.product);
        } else {
          setProduct(null);
          setError("Failed to load product details: Unexpected response format.");
          console.error("Failed to load product details: Unexpected response format", response);
        }
      } catch (err: any) {
        console.error("Failed to fetch product details:", err);
        setProduct(null);
        setError(`Failed to load product details: ${err.message || "An error occurred"}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, token]);

  if (error) {
    
    return <Text style={{ padding: 32, color: 'red' }}>{error}</Text>;
  }

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(drawer)/(tabs)/Inventory')}>
          <ArrowLeft size={32} color={Colors.accent} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Product Details
        </Text>
        <ArrowLeft size={32} color={"transparent"} strokeWidth={1.5} />
      </View>

      {isLoading ? (
        <ScrollView style={styles.scrollViewContainer}>
          <View style={styles.imageContainer}>
            <View style={{ width: '100%', height: 300, backgroundColor: Colors.primary }} />
          </View>
          <View style={styles.detailsContainer}>
            <View style={{ width: '40%', height: 16, backgroundColor: Colors.primary, marginBottom: 8 }} />
            <View style={{ width: '80%', height: 24, backgroundColor: Colors.primary, marginBottom: 4 }} />
            <View style={{ width: '30%', height: 16, backgroundColor: Colors.primary, marginBottom: 24 }} />
            <View style={styles.actionButtonsContainer}>
              <View style={{ flex: 1, height: 40, backgroundColor: Colors.primary, borderRadius: 12 }} />
              <View style={{ flex: 1, height: 40, backgroundColor: Colors.primary, borderRadius: 12 }} />
            </View>
            <View style={{ width: '90%', height: 16, backgroundColor: Colors.primary, marginTop: 24 }} />
            <View style={{ width: '85%', height: 16, backgroundColor: Colors.primary, marginTop: 4 }} />
            <View style={{ width: '70%', height: 16, backgroundColor: Colors.primary, marginTop: 4 }} />
            <View style={{ width: '20%', height: 16, backgroundColor: Colors.primary, marginTop: 8 }} />
            <View style={{ width: '100%', height: 48, backgroundColor: Colors.primary, borderRadius: 24, marginTop: 24 }} />
            <View style={{ width: '100%', height: 48, backgroundColor: Colors.primary, borderRadius: 24, marginTop: 16 }} />
            <View style={{ width: '50%', height: 18, backgroundColor: Colors.primary, marginTop: 32 }} />
            <View style={styles.statisticsRow}>
              <View style={{ width: '48%' }}>
                <View style={{ width: '70%', height: 14, backgroundColor: Colors.primary, marginBottom: 4 }} />
                <View style={{ width: '50%', height: 16, backgroundColor: Colors.primary }} />
              </View>
              <View style={{ width: '48%' }}>
                <View style={{ width: '70%', height: 14, backgroundColor: Colors.primary, marginBottom: 4 }} />
                <View style={{ width: '50%', height: 16, backgroundColor: Colors.primary }} />
              </View>
            </View>
            <View style={{ width: '50%', height: 18, backgroundColor: Colors.primary, marginTop: 32 }} />
            <View style={styles.salesTimeToggleContainer}>
              <View style={{ width: '20%', height: 20, backgroundColor: Colors.primary, borderRadius: 8 }} />
              <View style={{ width: '20%', height: 20, backgroundColor: Colors.primary, borderRadius: 8 }} />
              <View style={{ width: '20%', height: 20, backgroundColor: Colors.primary, borderRadius: 8 }} />
              <View style={{ width: '20%', height: 20, backgroundColor: Colors.primary, borderRadius: 8 }} />
            </View>
            <View style={styles.salesRow}>
              <View style={{ width: '48%' }}>
                <View style={{ width: '70%', height: 14, backgroundColor: Colors.primary, marginBottom: 4 }} />
                <View style={{ width: '50%', height: 16, backgroundColor: Colors.primary }} />
              </View>
              <View style={{ width: '48%' }}>
                <View style={{ width: '70%', height: 14, backgroundColor: Colors.primary, marginBottom: 4 }} />
                <View style={{ width: '50%', height: 16, backgroundColor: Colors.primary }} />
              </View>
            </View>
            <View style={styles.growthRateContainer}>
              <View style={{ width: '60%', height: 16, backgroundColor: Colors.primary, marginBottom: 8 }} />
              <View style={{ width: '30%', height: 14, backgroundColor: Colors.primary, marginBottom: 8 }} />
              <View style={{ width: '100%', height: 48, backgroundColor: Colors.primary, borderRadius: 12 }} />
            </View>
          </View>
        </ScrollView>
      ) : product ? (
        <ScrollView style={styles.scrollViewContainer}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image_url }} style={styles.productImage} />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.categoryText}>{product.category}</Text>
            <View style={styles.titlePriceContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productUnits}>{product.quantity} Units</Text>
              </View>
              <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
            </View>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.restockButton}>
                <Text style={styles.restockButtonText}>Restock Item</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sellButton}>
                <Text style={styles.sellButtonText}>Sell Item</Text>
              </TouchableOpacity>
            </View>
            {product.description ? (
              <Text style={styles.descriptionText}>{product.description}</Text>
            ) : null}
            <TouchableOpacity style={styles.viewMoreButton}>
              <Text style={styles.viewMoreButtonText}>View More</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateButton}>
              <Text style={styles.updateButtonText}>Update Information</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <Text style={styles.statisticsTitle}>Statistics</Text>
            <View style={styles.statisticsRow}>
              <View>
                <Text style={styles.statisticsLabel}>Market Share</Text>
                <Text style={styles.statisticsValue}>--</Text>
              </View>
              <View>
                <Text style={styles.statisticsLabel}>Remaining</Text>
                <Text style={styles.statisticsValue}>{product.quantity} units</Text>
              </View>
            </View>
            <Text style={styles.salesTitle}>Sales</Text>
            <View style={styles.salesTimeToggleContainer}>
              <Text style={styles.salesTimeToggleText}>Daily</Text>
              <Text style={styles.salesTimeToggleText}>Weekly</Text>
              <Text style={[styles.salesTimeToggleText, styles.activeSalesTimeToggle]}>Annual</Text>
              <Text style={styles.salesTimeToggleText}>Monthly</Text>
            </View>
            <View style={styles.salesRow}>
              <View>
                <Text style={styles.salesLabel}>Total Sales</Text>
                <Text style={styles.salesValue}>--</Text>
              </View>
              <View>
                <Text style={styles.salesLabel}>Revenue</Text>
                <Text style={styles.salesValue}>--</Text>
              </View>
            </View>
            <View style={styles.growthRateContainer}>
              <Text style={styles.growthRateTitle}>Growth Rate</Text>
              <Text style={styles.growthRateValue}>--</Text>
              <View style={styles.growthRateGraphPlaceholder} />
            </View>
          </View>
        </ScrollView>
      ) : (
        <Text style={{ padding: 32 }}>Product not found</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.light,
  },
  scrollViewContainer: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  headerTitle: {
    fontFamily: Fonts.outfit.regular,
    fontSize: 18,
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: "contain",
  },
  detailsContainer: {
    padding: 24,
  },
  categoryText: {
    color: "#7C7C7C",
    fontFamily: Fonts.publicSans.regular,
    fontSize: 15,
    marginBottom: 4,
  },
  titlePriceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 4,
  },
  productName: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 24,
  },
  productUnits: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 15,
    color: "#1B2821",
  },
  productPrice: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 24,
    color: Colors.accent,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  restockButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  restockButtonText: {
    fontFamily: Fonts.publicSans.medium,
    fontSize: 16,
  },
  sellButton: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  sellButtonText: {
    fontFamily: Fonts.publicSans.medium,
    fontSize: 16,
    color: Colors.light,
  },
  descriptionText: {
    marginTop: 24,
    fontFamily: Fonts.publicSans.regular,
    fontSize: 15,
    color: Colors.secondary,
  },
  viewMoreButton: {
    marginTop: 8,
  },
  viewMoreButtonText: {
    color: Colors.accent,
    fontFamily: Fonts.publicSans.medium,
  },
  updateButton: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
  },
  updateButtonText: {
    fontFamily: Fonts.publicSans.medium,
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 16,
    backgroundColor: "#F35B5B",
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
  },
  deleteButtonText: {
    fontFamily: Fonts.publicSans.medium,
    fontSize: 16,
    color: Colors.light,
  },
  statisticsTitle: {
    marginTop: 32,
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 18,
  },
  statisticsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  statisticsLabel: {
    color: Colors.secondary,
    fontFamily: Fonts.publicSans.regular,
  },
  statisticsValue: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 16,
  },
  salesTitle: {
    marginTop: 32,
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 18,
  },
  salesTimeToggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 12,
  },
  salesTimeToggleText: {
    fontFamily: Fonts.publicSans.medium,
    color: Colors.secondary,
  },
  activeSalesTimeToggle: {
    backgroundColor: "#E6F2EC",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  salesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  salesLabel: {
    color: Colors.secondary,
    fontFamily: Fonts.publicSans.regular,
  },
  salesValue: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 16,
  },
  growthRateContainer: {
    backgroundColor: "#E6F2EC",
    borderRadius: 24,
    padding: 16,
    marginTop: 24,
  },
  growthRateTitle: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 16,
  },
  growthRateValue: {
    fontFamily: Fonts.publicSans.medium,
    color: Colors.accent,
    marginBottom: 8,
  },
  growthRateGraphPlaceholder: {
    height: 48,
    backgroundColor: "#D9EDE3",
    borderRadius: 12,
  },
});