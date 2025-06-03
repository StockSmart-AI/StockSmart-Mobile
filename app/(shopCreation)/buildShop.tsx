import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Colors, Fonts } from '@/constants/Theme'; // Assuming Colors and Fonts are in this path
import { useShopCreation } from "@/context/ShopCreationContext"; // Import useShopCreation
import { AuthContext } from "@/context/AuthContext"; // Import AuthContext
import { createShop } from "@/api/shop"; // Import createShop
import { sendInvitationAndPermissions } from "@/api/user"; // Import the new API function
import { useRouter } from "expo-router"; // Import useRouter
import { useShop } from "@/context/ShopContext"; // Import useShop

const BuildShopLoadingScreen = () => {
  const { shopDetails } = useShopCreation(); // Get shopDetails
  const { token, logout } = useContext(AuthContext); // Get token and logout
  const router = useRouter(); // Get router
  const { fetchShops } = useShop(); // Get refreshShops from useShop
  const [loadingText, setLoadingText] = useState("Building your shop..."); // State for loading text
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleShopCreationProcess = async () => {
      if (!token) {
        console.error("No token found for shop creation process.");
        logout();
        return;
      }

      // Prevent duplicate submissions
      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);

      try {
        // 1. Create the shop
        setLoadingText("Building your shop...");
        const shopCreationResponse = await createShop(shopDetails.shopName, `${shopDetails.street}, ${shopDetails.building}, ${shopDetails.unit}`, token);
        
        if (shopCreationResponse && shopCreationResponse.data && shopCreationResponse.data.shop) {
          const shopId = shopCreationResponse.data.shop;
           
          console.log("Shop created successfully with ID:", shopId);

          // 2. Send invitations and set permissions for each employee
          setLoadingText("Sending employee invites and setting permissions...");
          const employees = shopDetails.employees || []; // Ensure employees is an array
          const permissions = shopDetails.permissions || {}; // Ensure permissions is an object

          for (const employee of employees) {
            const employeeEmail = employee.email;
            // Default permission to false if not found
            const canRestock = permissions[employeeEmail] || true;

            try {
              await sendInvitationAndPermissions(token, shopId, employeeEmail, canRestock);
              console.log(`Invitation and permission sent for ${employeeEmail}`);
            } catch (inviteError) {
              console.error(`Failed to send invitation/permission for ${employeeEmail}:`, inviteError);
              // Decide how to handle individual employee invitation failures
              // Continue to the next employee or stop? For now, we'll log and continue.
            }
          }

          // 3. Navigate after all tasks are attempted
          setLoadingText("Shop setup complete!");

          // Refresh the shop list in ShopContext
          fetchShops();

          // Delay navigation slightly to show the completion text
          setTimeout(() => {
            router.replace('/'); // Navigate to your desired post-creation screen
          }, 1500);

        } else {
          console.error("Shop creation failed: Invalid response or missing shop_id");
          // Handle unexpected response structure from shop creation
          setLoadingText("Shop creation failed.");
          setTimeout(() => {
            router.back(); // Navigate back on failure
          }, 1500);
        }
      } catch (error) {
        console.error("Shop creation process error:", error);
        setLoadingText("Shop setup failed.");
        setTimeout(() => {
          router.back(); // Navigate back on error
        }, 1500);
      } finally {
        setIsSubmitting(false);
      }
    };

    handleShopCreationProcess();
  }, [token, shopDetails, router, logout, fetchShops, isSubmitting]); // Add refreshShops to dependencies

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hold on while{'\n'}we <Text style={{ color: Colors.accent }}>Build</Text> your shop...
      </Text>
      
      {/* Placeholder for the illustration */}
      <View style={styles.illustrationContainer}>
        <Image style={styles.illustration} source={require('@/assets/images/shop.png')}/>
      </View>

      <ActivityIndicator size="large" color={Colors.accent} style={styles.spinner} />
      
      <Text style={styles.loadingText}>{loadingText}</Text> {/* Use state for dynamic text */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  illustrationContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  illustration: {
    width: 200, // Adjust size as needed
    height: 150, // Adjust size as needed
    borderRadius: 10,
  },
  // illustration: {
  //   width: 200, // Adjust based on your image
  //   height: 150, // Adjust based on your image
  //   resizeMode: 'contain',
  // },
  spinner: {
    marginBottom: 20,
  },
  loadingText: { // Style for the dynamic loading text
    fontSize: 18,
    fontFamily: Fonts.plusJakarta.regular,
    color: Colors.text,
    textAlign: 'center',
  },
});

export default BuildShopLoadingScreen; 