import React, { useContext, useState } from "react";
import { View, TextInput, Button } from "react-native";
import { AuthContext } from "../context/AuthContext";
import PublicRoute from "../components/PublicRoute";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <PublicRoute>
      <View>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    </PublicRoute>
  );
}
