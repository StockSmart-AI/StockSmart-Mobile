import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ColorValue,
  Platform,
  Image,
} from "react-native";
import { router } from "expo-router";
import {
  Boxes,
  ArrowLeft,
  Milk,
  Icon,
  CircleOff,
  Barcode,
  ImagePlus,
  X,
} from "lucide-react-native";
import {
  bottleChampagne,
  jar,
  bottleBaby,
  bottleDispenser,
  bottlePerfume,
} from "@lucide/lab";
import { Colors, Fonts } from "@/constants/Theme";
import * as ImagePicker from "expo-image-picker";
import AlertThresholdSlider from "@/components/ThresholdSlider";

const categories = [
  {
    name: "Dairy",
    icon: (color: ColorValue) => (
      <Milk color={color} size={36} strokeWidth={1.5} />
    ),
  },
  {
    name: "Beverage",
    icon: (color: ColorValue) => (
      <Icon
        iconNode={bottleChampagne}
        color={color}
        size={36}
        strokeWidth={1.5}
      />
    ),
  },
  {
    name: "Processed",
    icon: (color: ColorValue) => (
      <Icon iconNode={jar} color={color} size={36} strokeWidth={1.5} />
    ),
  },
  {
    name: "Baby",
    icon: (color: ColorValue) => (
      <Icon iconNode={bottleBaby} color={color} size={36} strokeWidth={1.5} />
    ),
  },
  {
    name: "Cleaning",
    icon: (color: ColorValue) => (
      <Icon
        iconNode={bottleDispenser}
        color={color}
        size={36}
        strokeWidth={1.5}
      />
    ),
  },
  {
    name: "Cosmetics",
    icon: (color: ColorValue) => (
      <Icon
        iconNode={bottlePerfume}
        color={color}
        size={36}
        strokeWidth={1.5}
      />
    ),
  },
  {
    name: "Other",
    icon: (color: ColorValue) => (
      <Boxes color={color} size={36} strokeWidth={1.5} />
    ),
  },
];

export default function NewProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Other");
  const [isSerialized, setIsSerialized] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(0);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={32} color={Colors.accent} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={{ fontFamily: Fonts.outfit.medium, fontSize: 20 }}>
          New Product
        </Text>
        <ArrowLeft size={32} color={"transparent"} strokeWidth={1.5} />
      </View>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Add Product Details</Text>
        <Text style={{ fontSize: 16, fontFamily: Fonts.plusJakarta.medium }}>
          Step 1/2
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.form}
      >
        <View style={{ gap: 10 }}>
          <Text style={styles.label}>Name and price</Text>
          <View style={[styles.inputContainer]}>
            <TextInput
              style={[styles.input, { flex: 3 }]}
              placeholder="Product name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, { flex: 2 }]}
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
            />
          </View>
        </View>
        <View style={{ gap: 10 }}>
          <Text style={styles.label}>Select category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.radio,
                  {
                    borderColor:
                      selectedCategory === category.name
                        ? Colors.accent
                        : Colors.text,
                  },
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <View style={styles.radioContent}>
                  {category.icon(
                    selectedCategory === category.name
                      ? Colors.accent
                      : Colors.text
                  )}
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.plusJakarta.medium,
                      color:
                        selectedCategory === category.name
                          ? Colors.accent
                          : Colors.text,
                    }}
                  >
                    {category.name}
                  </Text>
                </View>
                <View>
                  <View
                    style={{
                      height: 16,
                      width: 16,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor:
                        selectedCategory === category.name
                          ? Colors.accent
                          : Colors.text,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 20,
                        backgroundColor:
                          selectedCategory === category.name
                            ? Colors.accent
                            : "transparent",
                      }}
                    ></View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={{ gap: 10 }}>
          <Text style={styles.label}>Seriallization</Text>
          <View style={styles.serialContainer}>
            <TouchableOpacity
              style={[
                styles.serialRadio,
                !isSerialized ? {} : { borderColor: Colors.accent },
              ]}
              onPress={() => {
                setIsSerialized(true);
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Barcode
                  size={18}
                  color={!isSerialized ? Colors.text : Colors.accent}
                />
                <Text
                  style={{
                    fontFamily: Fonts.plusJakarta.medium,
                    fontSize: 14,
                    color: !isSerialized ? Colors.text : Colors.accent,
                  }}
                >
                  Barcode
                </Text>
              </View>
              <View
                style={{
                  height: 16,
                  width: 16,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isSerialized ? Colors.accent : Colors.text,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 20,
                    backgroundColor: isSerialized
                      ? Colors.accent
                      : "transparent",
                  }}
                ></View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.serialRadio,
                isSerialized ? {} : { borderColor: Colors.accent },
              ]}
              onPress={() => {
                setIsSerialized(false);
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <CircleOff
                  size={16}
                  color={isSerialized ? Colors.text : Colors.accent}
                />
                <Text
                  style={{
                    fontFamily: Fonts.plusJakarta.medium,
                    fontSize: 14,
                    color: isSerialized ? Colors.text : Colors.accent,
                  }}
                >
                  Not Serialized
                </Text>
              </View>
              <View
                style={{
                  height: 16,
                  width: 16,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: !isSerialized ? Colors.accent : Colors.text,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 20,
                    backgroundColor: !isSerialized
                      ? Colors.accent
                      : "transparent",
                  }}
                ></View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text style={styles.label}>Alert me on</Text>
          <AlertThresholdSlider value={threshold} setValue={setThreshold} />
        </View>
        <View style={{ gap: 10 }}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { minHeight: 120, textAlignVertical: "top" }]}
            multiline={true}
            numberOfLines={4}
            placeholder="Write your description"
            value={description}
            onChangeText={setDescription}
          />
        </View>
        <View style={{ gap: 16 }}>
          <TouchableOpacity
            style={{
              borderRadius: 18,
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderStyle: "dashed",
              borderWidth: 1,
              borderColor: Colors.text,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={pickImage}
          >
            <Text style={{ fontSize: 16, fontFamily: Fonts.publicSans.medium }}>
              Upload Image
            </Text>
            <ImagePlus size={24} color={Colors.text} />
          </TouchableOpacity>
          <View>
            {image && (
              <View
                style={{
                  width: "100%",
                  aspectRatio: 1.3,
                  backgroundColor: Colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 24,
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 10,
                    padding: 6,
                    borderRadius: 200,
                    top: 16,
                    right: 16,
                  }}
                  onPress={() => setImage("")}
                >
                  <X color={Colors.light} size={24} strokeWidth={1.5} />
                </TouchableOpacity>
                <Image
                  source={{ uri: image }}
                  style={{
                    resizeMode: "contain",
                    height: "100%",
                    width: "100%",
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.continueButton,
          !image || !name || !price ? styles.disabledButton : {},
        ]}
        disabled={!image || !name || !price}
      >
        <Text
          style={{
            fontFamily: Fonts.plusJakarta.medium,
            fontSize: 17,
            color: Colors.light,
          }}
        >
          Create Product
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    padding: 20,
    gap: 16,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  form: {
    paddingVertical: 16,
    gap: 24,
  },
  headingContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  heading: {
    fontFamily: Fonts.outfit.medium,
    fontSize: 24,
  },
  label: {
    fontFamily: Fonts.plusJakarta.medium,
    fontSize: 15,
    color: Colors.tertiary,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
  },
  input: {
    minHeight: 56,
    borderRadius: 16,
    fontFamily: Fonts.plusJakarta.regular,
    fontSize: 15,
    color: Colors.secondary,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
  },
  radio: {
    width: 118,
    height: 112,
    borderWidth: 1,
    borderColor: Colors.text,
    padding: 12,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  radioContent: {
    height: "100%",
    justifyContent: "flex-end",
    gap: 8,
  },
  serialContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  serialRadio: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  continueButton: {
    backgroundColor: "#7ED1A7",
    borderRadius: 48,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },
  disabledButton: {
    backgroundColor: Colors.secondary,
    opacity: 0.8,
  },
});
