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

const shops = [
  "Shop-Merkato1",
  "Shop-Merkato2",
  "Shop-Merkato3",
  "Shop-Merkato4",
];

export default function Header() {
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);
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
      rotationCount.current += 1;
      setShopModal(true);
      Animated.timing(rotateAnim, {
        toValue: rotationCount.current,
        duration: 200,
        useNativeDriver: true,
      }).start();
      animateModalIn();
    } else {
      rotationCount.current -= 1;
      Animated.timing(rotateAnim, {
        toValue: rotationCount.current,
        duration: 200,
        useNativeDriver: true,
      }).start();
      animateModalOut(() => setShopModal(false));
    }
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
            Shop-Merkato
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
            },
          ]}
        >
          {shops.map((shop: String) => (
            <View key={shop} style={styles.listContainer}>
              <Text style={styles.listText}>{shop}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.addShopBtn}>
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
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Colors.light,
    elevation: 3,
    padding: 32,
    zIndex: 50,
    borderRadius: 16,
    gap: 24,
  },
  listContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  listText: {
    fontFamily: Fonts.publicSans.medium,
    fontSize: 17,
  },
  addShopBtn: {
    flex: 1,
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
