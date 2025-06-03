import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Colors, Fonts } from '@/constants/Theme';
import { router } from 'expo-router';
import { CameraView, Camera } from 'expo-camera';
import { BarcodeScanningResult } from 'expo-camera';
import { AuthContext } from '@/context/AuthContext';
import { useShop } from '@/context/ShopContext';
import Modal from '@/components/ui/Modal';
import SnackBar from '@/components/ui/Snackbar';
import { getProductByBarcode, deleteItemByBarcode } from '@/api/stock';
import Scanner from '@/components/Scanner';

export default function DeleteItem() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);

  const { token } = useContext(AuthContext);
  const { currentShop } = useShop();

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    if (scanned || isLoading) return;
    setScanned(true);
    setBarcode(result.data);
    await fetchProductDetails(result.data);
  };

  const fetchProductDetails = async (barcodeData: string) => {
    if (!token || !currentShop?.id) {
      setNotification({
        message: 'Authentication or shop information missing',
        type: 'error'
      });
      setScanned(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getProductByBarcode(token, barcodeData, currentShop.id);
      if (response?.data) {
        setProduct(response.data[0][barcodeData]);
        setShowModal(true);
      } else {
        setNotification({
          message: 'Product not found for this barcode',
          type: 'error'
        });
        setScanned(false);
      }
    } catch (error: any) {
      console.error('Failed to fetch product:', error);
      setNotification({
        message: error.response?.data?.error || 'Failed to fetch product details',
        type: 'error'
      });
      setScanned(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!barcode.trim()) {
      setNotification({
        message: 'Please enter a barcode',
        type: 'error'
      });
      return;
    }
    await fetchProductDetails(barcode.trim());
  };

  const handleDelete = async () => {
    if (!token || !currentShop?.id || !product) return;

    setIsLoading(true);
    try {
      await deleteItemByBarcode(token, barcode);
      setNotification({
        message: 'Item deleted successfully',
        type: 'success'
      });
      setShowModal(false);
      setProduct(null);
      setBarcode('');
      setScanned(false);
    } catch (error: any) {
      console.error('Failed to delete item:', error);
      setNotification({
        message: error.response?.data?.error || 'Failed to delete item',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (hasPermission === null) return <Text>Requesting permission...</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(drawer)/(tabs)')}>
          <ArrowLeft size={32} color={Colors.accent} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delete Item</Text>
        <ArrowLeft size={32} color="transparent" strokeWidth={1.5} />
      </View>

      <Scanner type="delete" onBarcodeScanned={handleBarCodeScanned} />

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Or enter barcode manually:</Text>
        <TextInput
          style={styles.input}
          value={barcode}
          onChangeText={setBarcode}
          placeholder="Enter barcode"
          keyboardType="numeric"
        />
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleManualSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Processing...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setScanned(false);
        }}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isLoading}
      />

      {notification && (
        <SnackBar
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light,
    gap: 48,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: Fonts.outfit.medium,
    fontSize: 20,
    color: Colors.text,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 12,
  },
  inputLabel: {
    fontFamily: Fonts.publicSans.medium,
    fontSize: 16,
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 50,
    padding: 16,
    fontSize: 16,
    fontFamily: Fonts.publicSans.regular,
  },
  submitButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.light,
    fontFamily: Fonts.publicSans.medium,
    fontSize: 18,
  },
}); 