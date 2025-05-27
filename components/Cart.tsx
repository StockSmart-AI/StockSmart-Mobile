import { useState, useRef, useMemo } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
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

const initialCartData = [
  {
    id: "1",
    name: "Pepsi Soda",
    category: "Beverage",
    quantity: 2,
    pricePerUnit: 25,
    isSerialized: true,
    barcodes: ["34534534534454", "675345346346345"],
    img: require("@/assets/images/image.png"), // Assuming image.png is generic or update path
  },
  {
    id: "2",
    name: "Milk Pack",
    category: "Dairy",
    quantity: 1,
    pricePerUnit: 60,
    isSerialized: false,
    barcodes: [],
    img: require("@/assets/images/image.png"), // Replace with actual image path if different
  },
  {
    id: "3",
    name: "Detergent Powder",
    category: "Cleaning",
    quantity: 3,
    pricePerUnit: 15,
    isSerialized: true,
    barcodes: ["12312312312312", "45645645645645", "78978978978978"],
    img: require("@/assets/images/image.png"), // Replace with actual image path if different
  },
];

const Cart = () => {
  const snapPoints = useMemo(() => ["10%", "90%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetState, setBottomSheetState] = useState(0);
  const [cartItems, setCartItems] = useState(initialCartData);

  const toggleBottomSheet = () => {
    if (bottomSheetState === 1) {
      setBottomSheetState(0);
    } else {
      setBottomSheetState(1);
    }
    bottomSheetRef.current?.snapToIndex(bottomSheetState);
  };

  const handleIncreaseQuantity = (itemId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && !item.isSerialized
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && !item.isSerialized && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleRemoveBarcode = (itemId: string, barcodeToRemove: string) => {
    setCartItems(
      (prevItems) =>
        prevItems
          .map((item) => {
            if (item.id === itemId && item.isSerialized) {
              const updatedBarcodes = item.barcodes.filter(
                (bc) => bc !== barcodeToRemove
              );
              return {
                ...item,
                barcodes: updatedBarcodes,
                quantity: updatedBarcodes.length,
              };
            }
            return item;
          })
          .filter((item) => !(item.isSerialized && item.quantity === 0)) // Remove item if serialized and quantity is 0
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
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
          {cartItems.length === 0 ? (
            <View style={styles.emptyCartContainer}>
              <Text style={styles.emptyCartText}>
                Your cart is empty. Add some items!
              </Text>
            </View>
          ) : (
            cartItems.map((item) => (
              <View key={item.id} style={styles.cartItemOuterContainer}>
                <View style={styles.cartItemRow}>
                  <View style={styles.cartItemImageAndDetails}>
                    <View style={styles.cartItemImageContainer}>
                      <Image source={item.img} style={styles.cartItemImage} />
                      <TouchableOpacity
                        style={styles.removeItemButton}
                        onPress={() => handleRemoveItem(item.id)}
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
                          onPress={() => handleIncreaseQuantity(item.id)}
                          disabled={item.isSerialized}
                        >
                          <CirclePlus
                            size={24}
                            color={
                              item.isSerialized
                                ? Colors.tertiary
                                : Colors.accent
                            }
                            strokeWidth={1.5}
                          />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                          onPress={() => handleDecreaseQuantity(item.id)}
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
                        {item.barcodes.map((barcode, index) => (
                          <View key={index} style={styles.barcodeTag}>
                            <Barcode
                              size={20}
                              color={Colors.light}
                              strokeWidth={1.5}
                            />
                            <Text style={styles.barcodeText}>{barcode}</Text>
                            <TouchableOpacity
                              onPress={() =>
                                handleRemoveBarcode(item.id, barcode)
                              }
                            >
                              <X
                                size={20}
                                color={Colors.light}
                                strokeWidth={1.5}
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
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
                cartItems.length === 0 && styles.disabledConfirmButton,
              ]}
              disabled={cartItems.length === 0}
            >
              <ShoppingBag color={Colors.light} size={20} strokeWidth={1.5} />
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.clearCartButton}
            onPress={handleClearCart}
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
    flexDirection: "row",
    gap: 10,
  },
  cartItemImageContainer: {
    position: "relative",
    width: 96,
    height: 96,
  },
  cartItemImage: {
    resizeMode: "contain",
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
