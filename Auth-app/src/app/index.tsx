import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  const [checking, setChecking] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const restore = async () => {
      const saved = await SecureStore.getItemAsync('token');
      setToken(saved);
      setChecking(false);
    };
    restore();
  }, []);

  const handleLogin = async (newToken: string) => {
    await SecureStore.setItemAsync('token', newToken);
    setToken(newToken);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    setToken(null);
  };

  if (checking) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#123a6b" />
      </View>
    );
  }

  if (token) {
    return <HomeScreen token={token} onLogout={handleLogout} />;
  }
  return <LoginScreen onLogin={handleLogin} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});