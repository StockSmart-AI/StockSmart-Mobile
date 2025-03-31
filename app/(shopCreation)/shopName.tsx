import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Pressable, TextInput, StyleSheet, Platform, KeyboardAvoidingView} from "react-native";
import { useRouter } from "expo-router";

const ShopNameScreen = () => {
    const router = useRouter();
    const [shopName, setShopName] = useState("");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Let's give</Text>
            <Text style={styles.subtitle}>your shop a name!</Text>
            <Text style={styles.label}>Shop Name</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Shoa-Merkato"
                placeholderTextColor="#A8B0A8"
                value={shopName}
                onChangeText={setShopName}
            />
            <Pressable style={[styles.button, !shopName && styles.disabledButton]}
                       disabled={!shopName} 
                       onPress={() => {
                        if (shopName){router.push("/shopLocation")}}}>

                       <Text style={styles.buttonText}>Continue</Text>
            </Pressable>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#1B2821",
    },
    subtitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#1B2821",
        marginBottom: 20,
    },
    label: {
        fontSize: 20,
        color: "#1B2821",
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#E8F2ED",
        padding: 15,
        borderRadius: 20,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#7ED1A7",
        padding: 15,
        borderRadius: 25,
        alignItems: "center",
        marginTop: 270,
    },
    buttonText: {
        fontSize: 16,
        color: "white",
        fontWeight: "bold",
    },
    disabledButton: {
        backgroundColor: "#B0C4B1",
    }
});

export default ShopNameScreen;
