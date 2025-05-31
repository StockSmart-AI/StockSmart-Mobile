import { CircleAlert, CircleCheck, Info, X } from "lucide-react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Easing,
  Animated,
  Pressable,
  Dimensions,
} from "react-native";
import { Fonts, Colors } from "@/constants/Theme";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const messageType = {
  error: {
    border: { borderColor: Colors.error, shadowColor: Colors.error },
    text: { color: Colors.error },
    icon: <CircleAlert size={20} color={Colors.error} />,
    exit: Colors.error,
  },
  success: {
    border: { borderColor: Colors.accent, shadowColor: Colors.accent },
    text: { color: Colors.accent },
    icon: <CircleCheck size={20} color={Colors.accent} />,
    exit: Colors.accent,
  },
  info: {
    border: { borderColor: Colors.secondary, shadowColor: Colors.secondary },
    text: { color: Colors.secondary },
    icon: <Info size={20} color={Colors.secondary} />,
    exit: Colors.secondary,
  },
};

export default function SnackBar(props) {
  const [counter, setCounter] = useState(10);
  const [isVisible, setIsVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressRef = useRef();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    let timer;

    if (counter > 0) {
      timer = setTimeout(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
    } else if (counter == 0) {
      setTimeout(() => {
        handleFadeOut();
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [counter]);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.animate(counter * 10, 800, Easing.linear);
    }
  }, [counter]);

  const handleFadeOut = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      if (props.onClose) props.onClose();
    });
  };

  if (!isVisible) return null;

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.container,
          messageType[props.type].border,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.messageContainer}>
          {messageType[props.type].icon}
          <Text style={[styles.message, messageType[props.type].text]}>
            {props.message}
          </Text>
        </View>
        <Pressable onPress={handleFadeOut}>
          <AnimatedCircularProgress
            ref={progressRef}
            size={30}
            width={1.5}
            fill={counter * 10}
            tintColor={messageType[props.type].exit}
          >
            {() => <X size={20} color={messageType[props.type].exit} />}
          </AnimatedCircularProgress>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: Dimensions.get('window').height,
    pointerEvents: 'box-none',
  },
  container: {
    position: "absolute",
    bottom: 120,
    width: "90%",
    alignSelf: "center",
    padding: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100,
    backgroundColor: Colors.light,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 3,
  },
  messageContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  message: {
    fontFamily: Fonts.plusJakarta.medium,
    fontSize: 13,
    color: Colors.secondary,
  },
});
