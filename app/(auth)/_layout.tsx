import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen 
                name="createAccount"
                options={{
                    title: "Create Account"
                }}
            />
            <Stack.Screen 
                name="chooseRole"
                options={{
                    title: "Choose Role"
                }}
            />
        </Stack>
    );
} 