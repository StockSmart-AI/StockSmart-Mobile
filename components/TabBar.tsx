import { View, StyleSheet } from "react-native";
import { useLinkBuilder } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LayoutGrid, Store, ChartBar, History } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors, Fonts } from "@/constants/Theme";

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.tabStyle,
        { backgroundColor: theme === "light" ? Colors.light : Colors.dark },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        let icon;
        switch (String(label)) {
          case "Dashboard":
            icon = (
              <LayoutGrid size={20} color={isFocused ? "#7ED1A7" : "#6C7D6D"} />
            );
            break;
          case "Inventory":
            icon = (
              <Store size={20} color={isFocused ? "#7ED1A7" : "#6C7D6D"} />
            );
            break;
          case "Reports":
            icon = (
              <ChartBar size={20} color={isFocused ? "#7ED1A7" : "#6C7D6D"} />
            );
            break;
          case "Transactions":
            icon = (
              <History size={20} color={isFocused ? "#7ED1A7" : "#6C7D6D"} />
            );
            break;
          default:
            break;
        }

        return (
          <PlatformPressable
            key={route.name}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabButtonStyle]}
            android_ripple={{ color: "transparent" }}
            unstable_pressDelay={1}
          >
            {icon}
            <Text
              style={[
                styles.labelStyle,
                { color: isFocused ? "#7ED1A7" : "#6C7D6D" },
              ]}
            >
              {String(label)}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabStyle: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    bottom: 0,
    marginHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    boxShadow: "0px -3px 20px 0px rgba(27, 40, 33, 0.08)",
  },

  labelStyle: {
    fontSize: 12,
    fontFamily: Fonts.publicSans.regular,
  },

  tabButtonStyle: {
    flex: 1,
    alignItems: "center",
  },
});
