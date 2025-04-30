import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Pressable, TextInput, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";

const ShopLocationScreen = () => {
    const router = useRouter();
    const [street, setStreet] = useState("");
    const [building, setBuilding] = useState("");
    const [unit, setUnit] = useState("");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Where is</Text>
            <Text style={styles.subtitle}>your shop located?</Text>
            
            <Text style={styles.label}>Street name</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Merkato"
                placeholderTextColor="#A8B0A8"
                value={street}
                onChangeText={setStreet}
            />
            
            <Text style={styles.label}>Building name</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Tiret Shopping Center bldg."
                placeholderTextColor="#A8B0A8"
                value={building}
                onChangeText={setBuilding}
            />
            
            <Text style={styles.label}>Unit number</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. shop number 12B"
                placeholderTextColor="#A8B0A8"
                value={unit}
                onChangeText={setUnit}
            />
            
            <Pressable 
                style={[styles.button, !street && !building && !unit && styles.disabledButton ]}
                disabled={!street && !building && !unit}
                onPress={()=>{
                    if (street && building && unit){
                        router.push("/addEmployee")
                    }
                }}>
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
        marginTop: 50,
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

export default ShopLocationScreen;
