import { useState, useRef, useMemo } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image, ActivityIndicator } from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Colors, Fonts } from "@/constants/Theme";
import {
  Barcode,
  ChevronDown,
  ChevronUp,
  CircleMinus,
  CirclePlus,
  Eraser,
  ShoppingBag,
  X,
} from "lucide-react-native";
import { ScrollView } from "react-native-gesture-handler";

interface CartItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  pricePerUnit: number;
  isSerialized: boolean;
  barcodes: string[];
  img: any; // Using any for image source type
  stockQuantity: number;
}

interface CartProps {
  items: CartItem[];
  onIncreaseQuantity: (itemId: string) => void;
  onDecreaseQuantity: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onRemoveBarcode: (itemId: string, barcode: string) => void;
  onClearCart: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

const Cart: React.FC<CartProps> = ({
  items,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  onRemoveBarcode,
  onClearCart,
  onConfirm,
  isSubmitting = false,
}) => {
  const snapPoints = useMemo(() => ["10%", "90%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetState, setBottomSheetState] = useState(0);

  const toggleBottomSheet = () => {
    if (bottomSheetState === 1) {
      setBottomSheetState(0);
    } else {
      setBottomSheetState(1);
    }
    bottomSheetRef.current?.snapToIndex(bottomSheetState);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.quantity * item.pricePerUnit,
    0
  );

  return (
    <BottomSheet
      enablePanDownToClose={false}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior="collapse"
          disappearsOnIndex={0}
          appearsOnIndex={1}
          opacity={0.6}
          style={{ backgroundColor: Colors.text }}
        />
      )}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ display: "none" }}
      index={bottomSheetState}
      backgroundStyle={styles.bottomSheetBackground}
      handleComponent={() => (
        <TouchableOpacity
          style={styles.handleComponentButton}
          onPress={toggleBottomSheet}
        >
          {bottomSheetState ? (
            <ChevronDown size={24} color={Colors.light} strokeWidth={1.5} />
          ) : (
            <ChevronUp size={24} color={Colors.light} strokeWidth={1.5} />
          )}
        </TouchableOpacity>
      )}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.cartHeaderContainer}>
          <Text style={styles.cartHeaderText}>Cart</Text>
          <Text style={styles.cartItemCountText}>{totalItems} items</Text>
        </View>
        <ScrollView
          style={{ maxHeight: "60%" }}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          {items.length === 0 ? (
            <View style={styles.emptyCartContainer}>
              <Text style={styles.emptyCartText}>
                Your cart is empty. Add some items!
              </Text>
            </View>
          ) : (
            items.map((item) => (
              <View key={item.id} style={styles.cartItemOuterContainer}>
                <View style={styles.cartItemRow}>
                  <View style={styles.cartItemImageAndDetails}>
                    <View style={styles.cartItemImageContainer}>
                      <Image source={item.img} style={styles.cartItemImage} />
                      <TouchableOpacity
                        style={styles.removeItemButton}
                        onPress={() => onRemoveItem(item.id)}
                      >
                        <X color={Colors.light} size={20} strokeWidth={1.5} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.cartItemDetails}>
                      <Text style={styles.cartItemCategory}>
                        {item.category}
                      </Text>
                      <Text style={styles.cartItemName}>{item.name}</Text>
                      <View style={styles.quantityControlContainer}>
                        <TouchableOpacity
                          onPress={() => onIncreaseQuantity(item.id)}
                          disabled={item.isSerialized || item.quantity >= item.stockQuantity}
                        >
                          <CirclePlus
                            size={24}
                            color={
                              item.isSerialized || item.quantity >= item.stockQuantity
                                ? Colors.tertiary
                                : Colors.accent
                            }
                            strokeWidth={1.5}
                          />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                          onPress={() => onDecreaseQuantity(item.id)}
                          disabled={item.isSerialized || item.quantity === 1}
                        >
                          <CircleMinus
                            size={24}
                            color={
                              item.isSerialized || item.quantity === 1
                                ? Colors.tertiary
                                : Colors.accent
                            }
                            strokeWidth={1.5}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.cartItemPrice}>
                    {item.quantity * item.pricePerUnit}ETB
                  </Text>
                </View>
                {item.isSerialized &&
                  item.barcodes &&
                  item.barcodes.length > 0 && (
                    <View style={styles.barcodeScrollViewContainer}>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.barcodeScrollContent}
                      >
                        {item.barcodes.map((barcode, index) => {
                          console.log(item.barcodes)
                          return (
                          <View key={index} style={styles.barcodeTag}>
                            <Barcode
                              size={20}
                              color={Colors.light}
                              strokeWidth={1.5}
                            />
                            <Text style={styles.barcodeText}>{barcode}</Text>
                            <TouchableOpacity
                              onPress={() =>
                                onRemoveBarcode(item.id, barcode)
                              }
                            >
                              <X
                                size={20}
                                color={Colors.light}
                                strokeWidth={1.5}
                              />
                            </TouchableOpacity>
                          </View>
                      )})}
                      </ScrollView>
                    </View>
                  )}
              </View>
            ))
          )}
        </ScrollView>
        <View style={styles.footerContainer}>
          <View style={styles.totalPriceAndConfirmButtonContainer}>
            <Text style={styles.totalPriceText}>
              {totalPrice.toFixed(2)}ETB
            </Text>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                (items.length === 0 || isSubmitting) && styles.disabledConfirmButton,
              ]}
              disabled={items.length === 0 || isSubmitting}
              onPress={onConfirm}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.light} />
              ) : (
                <>
                  <ShoppingBag color={Colors.light} size={20} strokeWidth={1.5} />
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.clearCartButton}
            onPress={onClearCart}
            disabled={items.length === 0 || isSubmitting}
          >
            <Eraser color={Colors.light} strokeWidth={1.5} size={20} />
            <Text style={styles.clearCartButtonText}>Clear Cart</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  bottomSheetBackground: {
    backgroundColor: Colors.light,
    width: "95%",
    marginLeft: "2.5%",
    elevation: 10,
  },
  handleComponentButton: {
    position: "absolute",
    backgroundColor: Colors.accent,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    top: -25,
    zIndex: 10,
  },
  cartHeaderContainer: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 32,
    borderBottomColor: Colors.tertiary,
    borderBottomWidth: 0.5,
  },
  cartHeaderText: {
    fontFamily: Fonts.outfit.medium,
    fontSize: 24,
  },
  cartItemCountText: {
    fontFamily: Fonts.publicSans.regular,
    fontSize: 16,
  },
  scrollViewContentContainer: {
    padding: 24,
    flexGrow: 1, // Ensure container can grow to allow centering of empty cart message
    justifyContent: "space-between",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    fontFamily: Fonts.publicSans.regular,
    fontSize: 18,
    color: Colors.tertiary,
    textAlign: "center",
  },
  cartItemOuterContainer: {
    marginBottom: 16, // Add space between items
    borderBottomWidth: 0.5,
    borderColor: Colors.tertiary,
    paddingBottom: 16,
  },
  cartItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cartItemImageAndDetails: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  cartItemImageContainer: {
    position: "relative",
    width: 96,
    height: 96,
    borderRadius: 14,
    overflow: "hidden"
  },
  cartItemImage: {
    resizeMode: "cover",
    height: "100%",
    width: "100%",
  },
  removeItemButton: {
    position: "absolute",
    backgroundColor: `${Colors.tertiary}B0`,
    height: 24,
    width: 24,
    borderRadius: 24,
    top: 5,
    right: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cartItemDetails: {
    width: '50%',
    justifyContent: "center",
    gap: 4,
  },
  cartItemCategory: {
    fontFamily: Fonts.publicSans.regular,
    fontSize: 14,
    color: Colors.tertiary,
  },
  cartItemName: {
    fontFamily: Fonts.publicSans.semiBold,
    fontSize: 18,
    width: '80%',
  },
  quantityControlContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontFamily: Fonts.publicSans.semiBold,
  },
  cartItemPrice: {
    fontSize: 20,
    fontFamily: Fonts.publicSans.semiBold,
    color: Colors.accent,
    alignSelf: "center",
  },
  barcodeScrollViewContainer: {
    paddingVertical: 16,
    // borderBottomWidth: 0.5, // Removed as it's now on cartItemOuterContainer
    // borderColor: Colors.tertiary, // Removed
  },
  barcodeScrollContent: {
    flexDirection: "row",
    gap: 8,
  },
  barcodeTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: Colors.tertiary,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  barcodeText: {
    color: Colors.light,
    fontFamily: Fonts.publicSans.light,
    fontSize: 14,
  },
  footerContainer: {
    padding: 24,
    gap: 16,
    // borderTopWidth: 0.5,
    // borderTopColor: Colors.tertiary,
  },
  totalPriceAndConfirmButtonContainer: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  totalPriceText: {
    fontSize: 24,
    fontFamily: Fonts.outfit.semiBold,
  },
  confirmButton: {
    backgroundColor: Colors.text,
    paddingVertical: 12,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    flexGrow: 1,
  },
  disabledConfirmButton: {
    backgroundColor: Colors.tertiary,
  },
  confirmButtonText: {
    color: Colors.light,
    fontSize: 18,
  },
  clearCartButton: {
    backgroundColor: Colors.error,
    flexDirection: "row",
    paddingVertical: 12,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  clearCartButtonText: {
    fontFamily: Fonts.publicSans.regular,
    fontSize: 18,
    color: Colors.light,
  },
});

export default Cart;
