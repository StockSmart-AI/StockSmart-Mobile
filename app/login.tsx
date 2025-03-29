import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            console.log('Attempting to sign in with:', email);
            // TODO: Implement your own authentication logic here
            // For example, you could make an API call to your backend
            console.log('Sign in successful!');
            router.push('/'); // Navigate to root screen after successful sign in
        } catch (error: any) {
            console.error('Sign in error:', error.message);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };
   
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.txt}>
                    Sign In to{"\n"}Your Account
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
                <View style={styles.container2}>
                    <TouchableOpacity 
                        style={[styles.btn, loading && styles.disabledBtn]} 
                        onPress={handleSignIn}
                        disabled={loading}
                    >
                        <Text style={styles.btnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.btn, styles.createAccountBtn]} 
                        onPress={() => router.push('/createAccount')}
                    >
                        <Text style={[styles.btnText, styles.createAccountBtnText]}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    width: 361,
    height: 50,
    borderRadius: 16,
    paddingRight: 13,
    
    fontFamily: 'sans-serif',
    fontWeight: '400',
    fontSize: 17,
    color: "#6C7D6D",
    backgroundColor: "#E8F2ED",
    paddingTop: 13.5,
    paddingBottom: 13.5,
    paddingLeft: 13,
    borderWidth: 0,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  txt: {
    fontFamily: 'sans-serif',
    color: '#1B2821',
    fontSize: 32,
    paddingTop: 24,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    fontWeight: 700,
    letterSpacing: 0.64,
    marginBottom:10,
    
  },
  container2: {
    marginTop: 175,
  },
  btn: {
    backgroundColor: '#7ED1A7',
    paddingTop: 14.5,
    paddingRight: 16,
    paddingBottom: 14.5,
    paddingLeft: 16,
    width: 361,
    height: 50,
    borderRadius: 48,
    marginTop: 12,
    
    alignItems: 'center',
  },
  createAccountBtn: {
    backgroundColor: '#fff', // White background for Create Account button
    borderWidth: 1,
    borderColor: '#1B2821', // Optional: Add border to match the Sign In button
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  createAccountBtnText: {
    color: '#1B2821', // Text color for Create Account button
  },
  disabledBtn: {
    opacity: 0.7,
  },
});