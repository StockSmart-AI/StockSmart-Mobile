import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ShopCreationProvider } from "@/context/ShopCreationContext";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ShopCreationProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="shopName" options={{ title: 'Create Your Shop', headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: 'black',
          },
          headerTintColor: '#7ED1A7'

        }}/>

         <Stack.Screen name="shopLocation" options={{ title: 'Create Your Shop', headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: 'black',
          },
          headerTintColor: '#7ED1A7'

        }}/>
        <Stack.Screen name="addEmployee" options={{ title: 'Create Your Shop', headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: 'black',
          },
          headerTintColor: '#7ED1A7'

        }}/>
        <Stack.Screen name="grantRestock" options={{ title: 'Create Your Shop', headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: 'black',
          },
          headerTintColor: '#7ED1A7'

        }}/>

        <Stack.Screen name="sendInvitation" options={{headerShown: false}}/>

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </ShopCreationProvider>
  );
}
