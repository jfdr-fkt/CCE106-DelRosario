import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getCurrentUser, loginUser } from '../services/authService';
import { deleteToken, getToken, saveToken } from '../storage/tokenStorage';

export default function Index() {
  // Inputs start completely blank
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    setError('');
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setProfile(null);
        return;
      }
      const user = await getCurrentUser(token);
      setProfile(user);
    } catch (e) {
      try { await deleteToken(); } catch (cleanupError) {}
      setProfile(null);
      setError('Session expired. Please log in again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(username.trim(), password);
      await saveToken(data.accessToken);
      const user = await getCurrentUser(data.accessToken);
      setProfile(user);
      // Clear password after successful login for security
      setPassword(''); 
    } catch (e) {
      setError('Login failed. Check your username and password.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    try {
      await deleteToken();
    } catch (e) {}
    finally {
      setProfile(null);
      setError('');
      // Clear both fields on logout
      setUsername('');
      setPassword('');
      setShowPassword(false);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Secure Profile</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholder="Enter username"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter password"
            />
            <TouchableOpacity 
              style={styles.eyeBtn} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />
          <Button title="Login" onPress={handleLogin} disabled={!username || !password} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Authenticated Profile</Text>

        {profile.image ? <Image source={{ uri: profile.image }} style={styles.avatar} /> : null}
        <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
        <Text style={styles.info}>Username: {profile.username}</Text>
        <Text style={styles.info}>Email: {profile.email}</Text>
        <Text style={styles.info}>User ID: {profile.id}</Text>

        <View style={styles.spacer} />
        <Button title="Logout" onPress={handleLogout} color="#B3261E" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  content: { padding: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  loadingText: { marginTop: 12, fontSize: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#bbbbbb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbbbbb',
    borderRadius: 10,
    backgroundColor: '#fafafa',
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  eyeBtn: {
    padding: 5,
  },
  eyeText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  error: { color: '#B00020', fontSize: 15, marginBottom: 12, marginTop: 12 },
  spacer: { height: 24 },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 16 },
  name: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  info: { fontSize: 16, marginBottom: 6 },
});