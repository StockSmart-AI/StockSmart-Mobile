import React, { useState, useContext, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, Card, FAB, Portal, Modal, TextInput, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '@/constants/Theme';
import { CircleMinus, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import SnackBar from '@/components/ui/Snackbar';
import { getUserByEmail } from '@/api/user';
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

export default function StaffManagementScreen() {
  const router = useRouter();
  const { token } = useContext(AuthContext);
  
  // State management
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modal handlers
  const showModal = useCallback(() => setIsModalVisible(true), []);
  const hideModal = useCallback(() => {
    setIsModalVisible(false);
    setEmail('');
  }, []);

  // Notification handler
  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  }, []);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Employee management
  const handleAddEmployee = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      showNotification('Please enter an email address', 'error');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await getUserByEmail(token, trimmedEmail);
      
      if (response?.data) {
        const userData = response.data;
        const employeeToAdd: Employee = {
          id: Date.now().toString(),
          name: userData.name.split(' ')[0],
          role: 'Employee',
          email: userData.email
        };

        const isDuplicate = employees.some(
          emp => emp.email.toLowerCase() === employeeToAdd.email.toLowerCase()
        );

        if (!isDuplicate) {
          setEmployees(prev => [...prev, employeeToAdd]);
          setEmail('');
          hideModal();
          showNotification('Employee added successfully', 'success');
        } else {
          showNotification('Employee already added', 'error');
        }
      }
    } catch (error: any) {
      console.error('Error fetching user:', error);
      const errorMessage = error.response?.data?.message || 'User not found. Please check the email.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveEmployee = useCallback((id: string) => {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove this employee?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setEmployees(prev => prev.filter(emp => emp.id !== id));
            showNotification('Employee removed successfully', 'success');
          },
        },
      ]
    );
  }, [showNotification]);

  // Render employee card
  const renderEmployeeCard = useCallback((employee: Employee) => (
    <Card key={employee.id} style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.employeeAvatar}>
          <Text style={styles.avatarText}>
            {employee.name[0]?.toUpperCase()}
          </Text>
        </View>
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{employee.name}</Text>
          <Text style={styles.employeeRole}>{employee.role}</Text>
          <Text style={styles.employeeEmail}>{employee.email}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => handleRemoveEmployee(employee.id)}
          style={styles.removeButton}
        >
          <CircleMinus color={Colors.error} size={24} strokeWidth={1.5} />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  ), [handleRemoveEmployee]);

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
          <Text style={styles.headerTitle}>Staff Management</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Staff Management</Text>
          <Text style={styles.subtitle}>Manage your shop's employees</Text>
          
          <View style={styles.employeeList}>
            {employees.length === 0 ? (
              <Text style={styles.emptyText}>No employees added yet</Text>
            ) : (
              employees.map(renderEmployeeCard)
            )}
          </View>
        </ScrollView>

        <Portal>
          <Modal
            visible={isModalVisible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modal}
          >
            <Text style={styles.modalTitle}>Add New Employee</Text>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => setEmail(text.toLowerCase())}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              disabled={isLoading}
              theme={{ colors: { primary: Colors.accent } }}
              placeholder="Enter employee's email"
              error={email.length > 0 && !validateEmail(email)}
            />
            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                onPress={hideModal} 
                style={[styles.modalButton, styles.cancelButton]}
                labelStyle={styles.buttonLabel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={handleAddEmployee} 
                style={[styles.modalButton, styles.addButton]}
                labelStyle={styles.buttonLabel}
                loading={isLoading}
                disabled={isLoading || !validateEmail(email.trim())}
              >
                {isLoading ? 'Adding...' : 'Add Employee'}
              </Button>
            </View>
          </Modal>
        </Portal>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={showModal}
          color={Colors.light}
        />

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
  employeeList: {
    flex: 1,
    gap: 16,
  },
  card: {
    backgroundColor: Colors.light,
    borderRadius: 18,
    elevation: 2,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  employeeAvatar: {
    width: 48,
    height: 48,
    backgroundColor: Colors.accent,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.outfit.semiBold,
    fontSize: 20,
    color: Colors.light,
  },
  employeeInfo: {
    flex: 1,
    marginLeft: 16,
  },
  employeeName: {
    fontSize: 18,
    fontFamily: Fonts.outfit.semiBold,
    color: Colors.text,
  },
  employeeRole: {
    fontSize: 16,
    fontFamily: Fonts.outfit.regular,
    color: Colors.secondary,
    marginTop: 2,
  },
  employeeEmail: {
    fontSize: 14,
    fontFamily: Fonts.outfit.regular,
    color: Colors.tertiary,
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.accent,
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
    paddingHorizontal: 10,
  },
  cancelButton: {
    borderColor: Colors.text,
  },
  addButton: {
    backgroundColor: Colors.accent,
  },
  buttonLabel: {
    fontFamily: Fonts.outfit.medium,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: Fonts.outfit.regular,
    color: Colors.secondary,
    marginTop: 32,
  },
}); 