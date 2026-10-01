import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { type Student } from '@/components/StudentCard';
import { API_BASE_URL } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const router = useRouter();
  const { token, logout } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    const loadStudent = async () => {
      setLoading(true);
      setError('');
      setStudent(null);

      try {
        if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
          throw new Error('Invalid student ID.');
        }

        const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(id)}`);
        if (!active) {
          return;
        }
        if (response.status === 401 || response.status === 403) {
          await logout();
          return;
        }
        if (response.status === 404) {
          return;
        }
        if (!response.ok) {
          throw new Error('Unable to load student details. Please try again.');
        }

        const data = response.status === 204 ? null : await response.json();
        if (data !== null && (data.id !== Number(id) || typeof data.name !== 'string' || typeof data.email !== 'string')) {
          throw new Error('The API returned an invalid student record.');
        }
        if (active) {
          setStudent(data);
        }
      } catch (error) {
        if (active) {
          setError(error instanceof Error ? error.message : 'Unable to load student details.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadStudent();
    return () => {
      active = false;
    };
  }, [id, token, logout, retry]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Student Details</Text>
      {loading ? <View style={styles.state}><ActivityIndicator color="#245bb2" /><Text style={styles.text}>Loading student…</Text></View>
        : error ? (
          <View style={styles.state}>
            <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>
            <Pressable accessibilityRole="button" onPress={() => setRetry(retry + 1)}><Text style={styles.text}>Try Again</Text></Pressable>
          </View>
        )
        : !student ? <Text style={styles.text}>No student record available.</Text> : null}
      {!loading && !error && student ? (
        <View style={styles.card}>
          <Text style={styles.text}>ID: {student.id ?? id}</Text>
          <Text style={styles.text}>Name: {student.name || 'Not available'}</Text>
          <Text style={styles.text}>Email: {student.email || 'Not available'}</Text>
          <Text style={styles.text}>Username: {student.username || 'Not available'}</Text>
          <Text style={styles.text}>Phone: {student.phone || 'Not available'}</Text>
          <Text style={styles.text}>City: {student.address?.city || 'Not available'}</Text>
          <Text style={styles.text}>Company: {student.company?.name || 'Not available'}</Text>
        </View>
      ) : null}
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => router.canGoBack() ? router.back() : router.replace('/(app)/students')}><Text style={styles.buttonText}>Back</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 20, backgroundColor: '#f2f5fa' },
  title: { color: '#17324d', fontSize: 28, fontWeight: '700' },
  state: { gap: 12, alignItems: 'center' },
  card: { backgroundColor: '#ffffff', padding: 20, gap: 16, borderRadius: 12 },
  text: { color: '#536579', fontSize: 16 },
  error: { color: '#b42318' },
  button: { backgroundColor: '#245bb2', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
