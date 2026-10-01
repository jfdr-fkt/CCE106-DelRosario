import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/constants/api';
import { type User } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!active) {
          return;
        }
        if (response.status === 401 || response.status === 403) {
          await logout();
          return;
        }
        if (!response.ok) {
          throw new Error('Unable to load your profile. Please try again.');
        }

        const data = response.status === 204 ? null : await response.json();
        if (data !== null && (typeof data !== 'object' || Array.isArray(data))) {
          throw new Error('The API returned an invalid profile.');
        }
        if (active) {
          setProfile(data);
        }
      } catch (error) {
        if (active) {
          setError(error instanceof Error ? error.message : 'Unable to load your profile.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, [token, logout, retry]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MY PROFILE</Text>
      {loading ? <ActivityIndicator color="#245bb2" />
        : error ? (
          <View style={styles.card}>
            <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>
            <Pressable accessibilityRole="button" onPress={() => setRetry(retry + 1)}><Text style={styles.text}>Try Again</Text></Pressable>
          </View>
        ) : profile ? (
          <View style={styles.card}>
            <Text style={styles.text}>Name: {profile.name || 'Not available'}</Text>
            <Text style={styles.text}>Email: {profile.email || 'Not available'}</Text>
            <Text style={styles.text}>Role: {profile.role || 'Not available'}</Text>
          </View>
        ) : <Text style={styles.text}>No profile found.</Text>}
      <Text style={styles.text}>Session Status: {token ? 'Authenticated' : 'Not Available'}</Text>
      <Pressable accessibilityRole="button" style={styles.button} onPress={handleLogout} disabled={loggingOut}><Text style={styles.buttonText}>{loggingOut ? 'Signing out...' : 'LOGOUT'}</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 20, backgroundColor: '#f2f5fa' },
  title: { color: '#17324d', fontSize: 24, fontWeight: '700' },
  card: { backgroundColor: '#ffffff', padding: 20, gap: 16, borderRadius: 12 },
  text: { color: '#536579', fontSize: 16 },
  error: { color: '#b42318' },
  note: { color: '#536579', fontSize: 12 },
  button: { backgroundColor: '#245bb2', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
