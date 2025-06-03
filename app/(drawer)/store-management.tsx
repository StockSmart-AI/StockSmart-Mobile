import React, { useState, useContext, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Portal, Modal, TextInput, Provider as PaperProvider, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '@/constants/Theme';
import { ArrowLeft, Settings, User, Store, Trash2, Edit2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { useShop } from '@/context/ShopContext';
import SnackBar from '@/components/ui/Snackbar';
import { updateUser, deleteUser } from '@/api/user';

interface Notification {
  message: string;
  type: 'success' | 'error';
}

export default function StoreManagementScreen() {
  const router = useRouter();
  const { user, token, logout } = useContext(AuthContext);
  const { currentShop, updateShop, deleteShop } = useShop();
  
  // State management
  const [isShopModalVisible, setIsShopModalVisible] = useState(false);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [shopName, setShopName] = useState(currentShop?.name || '');
  const [shopAddress, setShopAddress] = useState(currentShop?.address || '');
  const [userName, setUserName] = useState(user?.name || '');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modal handlers
  const showShopModal = useCallback(() => setIsShopModalVisible(true), []);
  const hideShopModal = useCallback(() => {
    setIsShopModalVisible(false);
    setShopName(currentShop?.name || '');
    setShopAddress(currentShop?.address || '');
  }, [currentShop]);

  const showUserModal = useCallback(() => setIsUserModalVisible(true), []);
  const hideUserModal = useCallback(() => {
    setIsUserModalVisible(false);
    setUserName(user?.name || '');
  }, [user]);

  // Notification handler
  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  }, []);

  // Shop management
  const handleUpdateShop = async () => {
    if (!shopName.trim() || !shopAddress.trim()) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await updateShop(shopName.trim(), shopAddress.trim());
      hideShopModal();
      showNotification('Shop details updated successfully', 'success');
    } catch (error: any) {
      console.error('Error updating shop:', error);
      showNotification(error.message || 'Failed to update shop details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteShop = () => {
    Alert.alert(
      'Delete Shop',
      'Are you sure you want to delete this shop? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteShop();
              showNotification('Shop deleted successfully', 'success');
              router.replace('/(drawer)/(tabs)');
            } catch (error: any) {
              console.error('Error deleting shop:', error);
              showNotification(error.message || 'Failed to delete shop', 'error');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  // User management
  const handleUpdateUser = async () => {
    if (!userName.trim()) {
      showNotification('Please enter your name', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await updateUser(token, userName.trim());
      showNotification('User details updated successfully', 'success');
      hideUserModal();
    } catch (error: any) {
      console.error('Error updating user:', error);
      showNotification(error.message || 'Failed to update user details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteUser(token);
              await logout();
              router.replace('/(auth)/login');
            } catch (error: any) {
              console.error('Error deleting account:', error);
              showNotification(error.message || 'Failed to delete account', 'error');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.replace('/(drawer)/(tabs)')}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.text} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Store Management</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Store Management</Text>
          <Text style={styles.subtitle}>Manage your store and account settings</Text>

          {/* Shop Management Section */}
          <Card style={styles.section}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Store size={24} color={Colors.accent} strokeWidth={1.5} />
                <Text style={styles.sectionTitle}>Shop Settings</Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.sectionContent}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Shop Name:</Text>
                  <Text style={styles.value}>{currentShop?.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Address:</Text>
                  <Text style={styles.value}>{currentShop?.address}</Text>
                </View>
                <View style={styles.buttonGroup}>
                  <Button
                    mode="contained"
                    onPress={showShopModal}
                    style={[styles.button, styles.editButton]}
                    labelStyle={styles.buttonLabel}
                    icon={({ size, color }) => <Edit2 size={size} color={color} />}
                  >
                    Edit Shop
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleDeleteShop}
                    style={[styles.button, styles.deleteButton]}
                    labelStyle={styles.buttonLabel}
                    icon={({ size, color }) => <Trash2 size={size} color={color} />}
                  >
                    Delete Shop
                  </Button>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* User Management Section */}
          <Card style={styles.section}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <User size={24} color={Colors.accent} strokeWidth={1.5} />
                <Text style={styles.sectionTitle}>Account Settings</Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.sectionContent}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{user?.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{user?.email}</Text>
                </View>
                <View style={styles.buttonGroup}>
                  <Button
                    mode="contained"
                    onPress={showUserModal}
                    style={[styles.button, styles.editButton]}
                    labelStyle={styles.buttonLabel}
                    icon={({ size, color }) => <Edit2 size={size} color={color} />}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleDeleteAccount}
                    style={[styles.button, styles.deleteButton]}
                    labelStyle={styles.buttonLabel}
                    icon={({ size, color }) => <Trash2 size={size} color={color} />}
                  >
                    Delete Account
                  </Button>
                </View>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>

        {/* Shop Edit Modal */}
        <Portal>
          <Modal
            visible={isShopModalVisible}
            onDismiss={hideShopModal}
            contentContainerStyle={styles.modal}
          >
            <Text style={styles.modalTitle}>Edit Shop Details</Text>
            <TextInput
              label="Shop Name"
              value={shopName}
              onChangeText={setShopName}
              style={styles.input}
              mode="outlined"
              disabled={isLoading}
              theme={{ colors: { primary: Colors.accent } }}
            />
            <TextInput
              label="Address"
              value={shopAddress}
              onChangeText={setShopAddress}
              style={styles.input}
              mode="outlined"
              disabled={isLoading}
              theme={{ colors: { primary: Colors.accent } }}
            />
            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                onPress={hideShopModal} 
                style={[styles.modalButton, styles.cancelButton]}
                labelStyle={styles.buttonLabel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={handleUpdateShop} 
                style={[styles.modalButton, styles.saveButton]}
                labelStyle={styles.buttonLabel}
                loading={isLoading}
                disabled={isLoading}
              >
                Save Changes
              </Button>
            </View>
          </Modal>
        </Portal>

        {/* User Edit Modal */}
        <Portal>
          <Modal
            visible={isUserModalVisible}
            onDismiss={hideUserModal}
            contentContainerStyle={styles.modal}
          >
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              label="Name"
              value={userName}
              onChangeText={setUserName}
              style={styles.input}
              mode="outlined"
              disabled={isLoading}
              theme={{ colors: { primary: Colors.accent } }}
            />
            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                onPress={hideUserModal} 
                style={[styles.modalButton, styles.cancelButton]}
                labelStyle={styles.buttonLabel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={handleUpdateUser} 
                style={[styles.modalButton, styles.saveButton]}
                labelStyle={styles.buttonLabel}
                loading={isLoading}
                disabled={isLoading}
              >
                Save Changes
              </Button>
            </View>
          </Modal>
        </Portal>

        {notification && (
          <SnackBar
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.outfit.regular,
    color: Colors.secondary,
    marginBottom: 24,
  },
  section: {
    backgroundColor: Colors.light,
    borderRadius: 18,
    marginBottom: 24,
    elevation: 2,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
    marginLeft: 12,
  },
  divider: {
    backgroundColor: Colors.primary,
    opacity: 0.1,
    marginBottom: 16,
  },
  sectionContent: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.outfit.medium,
    color: Colors.secondary,
  },
  value: {
    fontSize: 16,
    fontFamily: Fonts.outfit.regular,
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontFamily: Fonts.outfit.medium,
    fontSize: 16,
  },
  editButton: {
    backgroundColor: Colors.accent,
  },
  deleteButton: {
    backgroundColor: Colors.error,
  },
  modal: {
    backgroundColor: Colors.light,
    padding: 24,
    margin: 24,
    borderRadius: 18,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.light,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelButton: {
    borderColor: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.accent,
  },
}); 