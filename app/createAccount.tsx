import { StyleSheet, Text, TextInput, View, TouchableOpacity , SafeAreaView} from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

export default function CreateAccount() {
    const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <Text style={styles.txt}>
        Create{"\n"}Your Account
      </Text>
      <View style={styles.horizontalContainer}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="First Name"
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Surname"
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
      />
      <Text style={styles.txt1}>By signing up, you agree to our terms and conditions.</Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.push('')}>
        <Text style={styles.btnText}>Create Account</Text>
      </TouchableOpacity>
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
  txt: {
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
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    
  },
  input: {
    width: '100%',
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
    marginBottom: 15,
    paddingHorizontal: 8,
    
  },
  halfInput: {
    width: '48%',
  },
  txt1: {
    fontWeight: 400,
    fontSize: 13,
    alignItems: 'center',
    color: "#6C7D6D",
    paddingLeft:20,
    marginTop:150,
    paddingBottom:15,

  },
  btn: {
    backgroundColor: '#7ED1A7',
    paddingTop: 14.5,
    paddingRight: 16,
    paddingBottom: 14.5,
    paddingLeft: 16,
    width: '100%',
    height: 50,
    borderRadius: 48,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
});