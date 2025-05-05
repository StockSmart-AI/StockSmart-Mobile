import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import styles from './styles'; // Import the styles

type RootStackParamList = {
  Index: undefined;
  ShopAccess: undefined;
};

type ShopAccessScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ShopAccess'>;
type ShopAccessScreenRouteProp = RouteProp<RootStackParamList, 'ShopAccess'>;

type Props = {
  navigation: ShopAccessScreenNavigationProp;
  route: ShopAccessScreenRouteProp;
};

const ShopAccess: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="green" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Shop access not permitted yet</Text>
        <View style={{ width: 24 }} /> {/* Placeholder to balance the header */}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Shop access not permitted yet</Text>
        <Text style={styles.description}>Looks like access to 'Shoa-Merkato' hasn't been granted yet by the owner.</Text>
        <TouchableOpacity style={[styles.button, styles.continueButton]}>
          <Text style={styles.buttonText}>Create Shop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShopAccess;