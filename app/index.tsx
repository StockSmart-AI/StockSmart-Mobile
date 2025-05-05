import React from "react";
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import styles from './styles'; // Import the styles

type RootStackParamList = {
  Index: undefined;
  ShopAccess: undefined;
};

type IndexScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Index'>;
type IndexScreenRouteProp = RouteProp<RootStackParamList, 'Index'>;

type Props = {
  navigation: IndexScreenNavigationProp;
  route: IndexScreenRouteProp;
};

const Index: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { /* Add navigation logic here */ }}>
                    <Ionicons name="arrow-back" size={24} color="green" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Select your shop</Text>
                <View style={{ width: 24 }} /> {/* Placeholder to balance the header */}
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>Which shop do you work at?</Text>
                <Text style={styles.label}>Shop Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Shoa-Merkato"
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text>Scan QR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.continueButton]} onPress={() => navigation.navigate('ShopAccess')}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Index;