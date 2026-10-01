import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { API_BASE_URL } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';

export default function SignInScreen() {
  const router = useRouter();
  const { login, logout, sessionError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (loading) {
      return;
    }
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (API_BASE_URL === 'REPLACE_WITH_EXAM_API') {
      setError('Please set the instructor\'s API URL in constants/api.ts.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        throw new Error(response.status === 401 ? 'Incorrect email or password.' : 'Login failed. Please try again.');
      }

      const data = await response.json();
      if (typeof data.token !== 'string' || !data.token.trim() || !data.user || typeof data.user !== 'object' || Array.isArray(data.user)) {
        throw new Error('The login response must include a token and user.');
      }

      await login(data.token, data.user);
      setPassword('');
      router.replace('/(app)');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.eyebrow}>CCE106 • PRACTICAL EXAMINATION</Text>
        <Text style={styles.title}>Student Service Portal</Text>
        <Text style={styles.subtitle}>Sign in to access student services.</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} accessibilityLabel="Email" placeholder="student@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} accessibilityLabel="Password" placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry />
        <View style={styles.feedback} accessibilityLiveRegion="polite">
          {loading && <ActivityIndicator color="#245bb2" accessibilityLabel="Signing in" />}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <Pressable accessibilityRole="button" style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Login'}</Text>
        </Pressable>
        {sessionError ? (
          <View style={styles.feedback}>
            <Text style={styles.error}>{sessionError}</Text>
            <Pressable accessibilityRole="button" onPress={logout}>
              <Text style={styles.note}>Clear saved session</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f2f5fa' },
  card: { width: '100%', maxWidth: 440, alignSelf: 'center', padding: 24, borderRadius: 16, backgroundColor: '#ffffff' },
  eyebrow: { fontSize: 11, fontWeight: '700', color: '#245bb2', marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '700', color: '#17324d' },
  subtitle: { color: '#536579', marginTop: 8, marginBottom: 24 },
  label: { color: '#17324d', fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#c6d2e1', borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 16, color: '#17324d' },
  feedback: { minHeight: 28 },
  error: { color: '#b42318' },
  button: { backgroundColor: '#245bb2', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '700' },
  note: { color: '#536579', fontSize: 12, marginTop: 20 },
});
