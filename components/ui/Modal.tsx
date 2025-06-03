import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal as RNModal } from 'react-native';
import { Colors, Fonts } from '@/constants/Theme';
import { X } from 'lucide-react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.text} strokeWidth={1.5} />
          </TouchableOpacity>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton]} 
              onPress={onConfirm}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, styles.confirmButtonText]}>
                {isLoading ? 'Processing...' : confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.light,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  title: {
    fontFamily: Fonts.outfit.semiBold,
    fontSize: 24,
    color: Colors.text,
    marginBottom: 12,
    marginRight: 24,
  },
  message: {
    fontFamily: Fonts.publicSans.regular,
    fontSize: 16,
    color: Colors.tertiary,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.light,
    borderWidth: 1,
    borderColor: Colors.text,
  },
  confirmButton: {
    backgroundColor: Colors.error,
  },
  buttonText: {
    fontFamily: Fonts.publicSans.medium,
    fontSize: 16,
  },
  cancelButtonText: {
    color: Colors.text,
  },
  confirmButtonText: {
    color: Colors.light,
  },
});

export default Modal; 