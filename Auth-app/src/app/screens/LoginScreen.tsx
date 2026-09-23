import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';

type Props = {
  onLogin: (token: string) => void;
};

export default function LoginScreen({ onLogin }: Props) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      const newToken = data.accessToken || data.token;
      if (!res.ok || !newToken) {
        setError(data.message || 'Login failed. Check your credentials.');
        return;
      }
      onLogin(newToken);
    } catch {
      setError('Cannot reach the server. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>🎓</Text>
        </View>
        <Text style={styles.title}>Student Portal</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggle}>{showPassword ? 'Hide' : 'Show'}</Text>
          </Pressable>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.button}>
          <Button title={loading ? 'Signing in...' : 'Login'} onPress={login} disabled={loading} />
        </View>
        <Text style={styles.hint}>Test account: emilys / emilyspass</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#123a6b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 34,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#123a6b',
  },
  subtitle: {
    color: '#64748b',
    marginTop: 4,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 10,
  },
  toggle: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
  error: {
    color: '#dc2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: 4,
  },
  hint: {
    marginTop: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});