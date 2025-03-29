import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Users } from 'lucide-react-native';

export default function ChooseRole() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<'owner' | 'employee' | null>(null);

    const handleContinue = () => {
        if (selectedRole) {
            // TODO: Save the selected role and navigate to the appropriate screen
            router.push('/');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                <Text style={styles.subHeading}>Which role {'\n'} suits you?</Text>

                {/* Owner Card */}
                <TouchableOpacity 
                    style={[
                        styles.card, 
                        selectedRole === 'owner' && styles.selectedCard
                    ]}
                    onPress={() => setSelectedRole('owner')}
                >
                    <View style={styles.cardIcon}>
                       <Image
                       source={require('@/assets/images/owner.png')}
                       style={styles.iconImage}
                       />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>OWNER</Text>
                        <Text style={styles.cardDescription}>
                            manage your shop and grow your business using the best tool to cater for your inventory needs
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Employee Card */}
                <TouchableOpacity 
                    style={[
                        styles.card, 
                        selectedRole === 'employee' && styles.selectedCard
                    ]}
                    onPress={() => setSelectedRole('employee')}
                >
                    
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>EMPLOYEE</Text>
                        <Text style={styles.cardDescription}>
                            Access your employers shop and make transactions with ease
                        </Text>
                    </View>
                    <View style={styles.cardIconEmployee}>
                        <Image
                            source={require('@/assets/images/employee.png')}
                            style={styles.iconImageEmployee}
                        />
                    </View>
                </TouchableOpacity>

                {/* Continue Button */}
                <TouchableOpacity 
                    style={[
                        styles.continueButton,
                        !selectedRole && styles.disabledButton
                    ]}
                    onPress={handleContinue}
                    disabled={!selectedRole}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    heading: {
        fontSize: 24,
        fontFamily: 'sans-serif',
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
    },
    subHeading: {
        fontFamily: 'sans-serif',
        color: '#1B2821',
        fontSize: 32,
        paddingTop: 24,
        paddingRight: 16,
        paddingBottom: 12,
        paddingLeft: 10,
        fontWeight: '600',
        letterSpacing: 2,
        marginBottom: 10,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FBFEFC',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#D4E8E6',
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    iconImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    selectedCard: {
        borderColor: '#4AB8A8',
        borderWidth: 2,
        backgroundColor: '#F0F9F8',
    },
    cardIcon: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginRight: 16,
    },
    cardIconEmployee: {
        width: 100,
        height: 112.32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginLeft: 16,
    },
    iconImageEmployee: {
        width: 100,
        height: 112.32,
        resizeMode: 'contain',
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'sans-serif',
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        fontFamily: 'sans-serif',
        color: '#6C7D6D',
        lineHeight: 20,
        fontWeight: '400',
    },
    continueButton: {
        backgroundColor: '#7ED1A7',
        borderRadius: 48,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 16,
    },
    disabledButton: {
        backgroundColor: '#A0A0A0',
        opacity: 0.5,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'sans-serif',
        fontWeight: '600',
    },
}); 