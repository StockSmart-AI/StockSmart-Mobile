import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { Colors, Fonts } from '@/constants/Theme';

export default function NewProductSuccessScreen() {
  const { productId } = useLocalSearchParams(); // Assuming the product ID will be passed as a param

  const handleSkip = () => {
    // Navigate back to Inventory or another appropriate screen
    router.replace('/(drawer)/(tabs)/Inventory');
  };

  const handleRestock = () => {
    // Navigate to the restock screen, passing the product ID
    if (productId) {
      router.push({ pathname: '/(drawer)/(stock)/restock', params: { id: productId as string } });
    } else {
      // Handle case where product ID is missing (shouldn't happen if navigated correctly)
      console.error("Product ID missing for restock.");
      handleSkip(); // Navigate away if ID is missing
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back}> {/* Use router.back to go back */}
          <ArrowLeft size={32} color={Colors.accent} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          New Product
        </Text>
        <View style={{ width: 32 }} /> {/* Placeholder for alignment */}
      </View>

      <View style={styles.content}>
        <Text style={styles.stepText}>Step 2/2</Text>
        <Text style={styles.restockHeading}>Restock your inventory</Text>

        <Image
          source={require('@/assets/images/restock-illustration.png')} // Placeholder image
          style={styles.illustrationImage}
          resizeMode="contain"
        />

        <CheckCircle size={60} color={Colors.accent} style={styles.checkIcon} />

        <Text style={styles.mainMessage}>Alright, Now lets shelf it!</Text>
        <Text style={styles.subMessage}>
          Your product has been added successfully, proceed to restock your
          product to your inventory
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.restockButton} onPress={handleRestock}>
          <Text style={styles.restockButtonText}>Restock</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    padding: 20,
    justifyContent: 'space-between', // Distribute content vertically
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // Space below header
  },
  headerTitle: {
    fontFamily: Fonts.outfit.medium,
    fontSize: 20,
  },
  content: {
    flex: 1, // Allow content to take available space
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically in the middle
  },
  stepText: {
    fontSize: 16,
    fontFamily: Fonts.plusJakarta.medium,
    color: Colors.secondary,
    marginBottom: 8,
  },
  restockHeading: {
    fontFamily: Fonts.outfit.medium,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  illustrationImage: {
    width: '80%',
    height: 200,
    marginBottom: 30,
  },
  checkIcon: {
    marginBottom: 20,
  },
  mainMessage: {
    fontFamily: Fonts.outfit.semiBold,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  subMessage: {
    fontFamily: Fonts.plusJakarta.regular,
    fontSize: 15,
    color: Colors.secondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20, // Space above buttons
  },
  skipButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 48,
    padding: 16,
    alignItems: 'center',
    backgroundColor: Colors.light, // White background for skip
  },
  skipButtonText: {
    fontFamily: Fonts.plusJakarta.medium,
    fontSize: 17,
    color: Colors.text,
  },
  restockButton: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: 48,
    padding: 16,
    alignItems: 'center',
  },
  restockButtonText: {
    fontFamily: Fonts.plusJakarta.medium,
    fontSize: 17,
    color: Colors.light,
  },
}); 