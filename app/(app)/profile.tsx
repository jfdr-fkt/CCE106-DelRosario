import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/constants/api';
import { type User } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { token, user, logout } = useAuth();
  const userId = user?.id;
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
        if (response.status === 401 || response.status === 403 || response.status === 404) {
          await logout();
          return;
        }
        if (!response.ok) {
          throw new Error('Unable to load your profile. Please try again.');
        }

        const data = response.status === 204 ? null : await response.json();
        if (data !== null && (data.id !== userId || typeof data.name !== 'string' || typeof data.email !== 'string')) {
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
  }, [userId, token, logout, retry]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.subtitle}>Your account information and session.</Text>
        {loading ? <ActivityIndicator color="#245bb2" />
          : error ? (
            <View style={styles.card}>
              <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>
              <Pressable accessibilityRole="button" onPress={() => setRetry(retry + 1)}><Text style={styles.text}>Try Again</Text></Pressable>
            </View>
          ) : profile ? (
            <View style={styles.card}>
              <View style={styles.profileHeader}>
                <View style={styles.avatar}><Ionicons name="person-outline" size={28} color="#245bb2" /></View>
                <Text style={styles.name}>{profile.name}</Text>
              </View>
              <Text style={styles.text}>Name: {profile.name || 'Not available'}</Text>
              <Text style={styles.text}>Email: {profile.email || 'Not available'}</Text>
              <Text style={styles.text}>Username: {profile.username || 'Not available'}</Text>
            </View>
          ) : <Text style={styles.text}>No profile found.</Text>}
        <Text style={styles.text}>Session Status: {token ? 'Authenticated' : 'Not Available'}</Text>
        <Pressable accessibilityRole="button" style={styles.button} onPress={handleLogout} disabled={loggingOut}><Text style={styles.buttonText}>{loggingOut ? 'Signing out...' : 'LOGOUT'}</Text></Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f2f5fa' },
  content: { width: '100%', maxWidth: 680, alignSelf: 'center', gap: 20 },
  title: { color: '#17324d', fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#536579', fontSize: 14, lineHeight: 22, marginTop: -12 },
  card: { backgroundColor: '#ffffff', padding: 24, gap: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e1e7ef' },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#edf0f5' },
  avatar: { padding: 14, backgroundColor: '#edf3ff', borderRadius: 16 },
  name: { color: '#17324d', fontSize: 20, fontWeight: '600', flex: 1 },
  text: { color: '#536579', fontSize: 16 },
  error: { color: '#b42318' },
  note: { color: '#536579', fontSize: 12 },
  button: { backgroundColor: '#fff0ef', borderWidth: 1, borderColor: '#f3d7d4', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#a33b32', fontWeight: '700' },
});
