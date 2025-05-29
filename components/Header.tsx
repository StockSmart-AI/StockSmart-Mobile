import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Bell, ChevronDown, Menu, Plus, Store } from "lucide-react-native";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Colors, Fonts } from "@/constants/Theme";
import { useTheme } from "@/context/ThemeContext";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { router } from "expo-router";
import { useShop } from "@/context/ShopContext";

export default function Header() {
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);
  const {
    shops,
    currentShop,
    switchShop,
    isLoading: isLoadingShops,
  } = useShop();
  const [showShopModal, setShopModal] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const rotationCount = useRef(0);

  const rotate = () => {
    showShopModal ? (rotationCount.current += 1) : (rotationCount.current -= 1);
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: rotationCount.current,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const animateModalIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateModalOut = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => callback());
  };

  const handleShowModal = () => {
    if (!showShopModal) {
      // rotationCount.current += 1; // Managed by rotateInterpolate logic now
      setShopModal(true);
      Animated.timing(rotateAnim, {
        toValue: 1, // Always rotate to "open" state
        duration: 200,
        useNativeDriver: true,
      }).start();
      animateModalIn();
    } else {
      // rotationCount.current -= 1; // Managed by rotateInterpolate logic now
      Animated.timing(rotateAnim, {
        toValue: 0, // Always rotate to "closed" state
        duration: 200,
        useNativeDriver: true,
      }).start();
      animateModalOut(() => setShopModal(false));
    }
  };

  const getShopDisplayText = () => {
    if (isLoadingShops) {
      return "Loading Shops...";
    }
    if (currentShop) {
      return currentShop.name;
    }
    if (shops.length === 0) {
      return "No Shops Available";
    }
    // If there's only one shop, and currentShop isn't set yet (e.g., initial load before context updates)
    // or if ShopContext defaults to the first shop if only one exists.
    if (shops.length === 1 && shops[0]) {
      return shops[0].name;
    }
    return "Select a Shop";
  };

  return (
    <View>
      <View
        style={[
          styles.headerContainer,
          { backgroundColor: theme === "light" ? Colors.light : Colors.dark },
        ]}
      >
        <DrawerToggleButton tintColor={Colors.accent} />
        <TouchableOpacity style={styles.shopToggle} onPress={handleShowModal}>
          <Text
            style={[
              styles.shopLabel,
              { color: theme === "light" ? Colors.text : Colors.textWhite },
            ]}
          >
            {getShopDisplayText()}
          </Text>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <ChevronDown size={24} color={Colors.accent} />
          </Animated.View>
        </TouchableOpacity>
        <Bell size={20} color={Colors.accent} />
      </View>
      {showShopModal && (
        <Animated.View
          style={[
            styles.shopModal,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              backgroundColor:
                theme === "light" ? Colors.light : Colors.darkModal, // Adjust background for theme
            },
          ]}
        >
          {isLoadingShops ? (
            <Text
              style={[
                styles.listText,
                { color: theme === "light" ? Colors.text : Colors.textWhite },
              ]}
            >
              Loading shops...
            </Text>
          ) : shops.length === 0 ? (
            <Text
              style={[
                styles.listText,
                { color: theme === "light" ? Colors.text : Colors.textWhite },
              ]}
            >
              No shops yet. Create one below!
            </Text>
          ) : shops.length === 1 ? (
            <Text
              style={[
                styles.listText,
                {
                  color: theme === "light" ? Colors.tertiary : Colors.textWhite,
                  fontFamily: Fonts.publicSans.medium,
                  fontSize: 15,
                },
              ]}
            >
              Your other shops will appear here
            </Text>
          ) : (
            shops.map((shop) => (
              <TouchableOpacity
                key={shop.id}
                style={styles.listContainer}
                onPress={() => {
                  if (currentShop?.id !== shop.id) {
                    switchShop(shop.id);
                  }
                  handleShowModal(); // Close modal after selection or if same shop clicked
                }}
              >
                <Text
                  style={[
                    styles.listText,
                    {
                      color: theme === "light" ? Colors.text : Colors.textWhite,
                      fontFamily:
                        currentShop?.id === shop.id
                          ? Fonts.publicSans.bold
                          : Fonts.publicSans.medium,
                    },
                  ]}
                >
                  {shop.name}
                </Text>
              </TouchableOpacity>
            ))
          )}
          <TouchableOpacity
            style={styles.addShopBtn}
            onPress={() => {
              handleShowModal(); // Close modal before navigating
              router.push("/(shopCreation)/shopName");
            }}
          >
            <Plus color={Colors.accent} size={24} />
            <Text style={styles.addShopText}>New Shop</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },

  shopLabel: {
    fontSize: 17,
    fontFamily: Fonts.publicSans.semiBold,
  },

  shopToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  shopModal: {
    position: "absolute",
    top: "100%",
    width: "80%",
    // flex: 1, // Not needed if content drives height
    alignItems: "center", // Center items like the "Your shops will appear here" text
    alignSelf: "center",
    // backgroundColor: Colors.light, // Handled dynamically
    elevation: 3,
    paddingVertical: 24, // Adjusted padding
    paddingHorizontal: 16, // Adjusted padding
    zIndex: 50,
    borderRadius: 16,
    gap: 16, // Adjusted gap
  },
  listContainer: {
    // flex: 1, // Not needed if it's just a row
    width: "100%", // Make touchable area wider
    flexDirection: "row",
    alignItems: "center", // Ensure text within is centered if it's the only element
    justifyContent: "center", // Center the text for single item messages
    paddingVertical: 8, // Add some padding for better touch
    gap: 16,
  },
  listText: {
    fontFamily: Fonts.publicSans.medium,
    fontSize: 17,
    textAlign: "center", // Ensure text like "Your shops will appear here" is centered
  },
  addShopBtn: {
    // flex: 1, // Not needed
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    gap: 6,
    borderColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 50,
  },
  addShopText: {
    color: Colors.accent,
    fontFamily: Fonts.publicSans.medium,
    fontSize: 15,
  },
});
