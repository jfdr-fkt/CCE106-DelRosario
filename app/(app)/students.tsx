import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import StudentCard, { type Student } from '@/components/StudentCard';
import { API_BASE_URL } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';

export default function StudentsScreen() {
  const { token, logout } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    const loadStudents = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE_URL}/students`, {
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
          throw new Error('Unable to load students. Please try again.');
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.some((item) =>
          !item || !Number.isInteger(item.id) || typeof item.name !== 'string' || typeof item.email !== 'string'
        )) {
          throw new Error('The API must return a student array.');
        }
        if (active) {
          setStudents(data);
        }
      } catch (error) {
        if (active) {
          setError(error instanceof Error ? error.message : 'Unable to load students.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadStudents();
    return () => {
      active = false;
    };
  }, [token, logout, retry]);

  const filteredStudents = students.filter((student) =>
    (student.name || '').toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Students</Text>
        <Text style={styles.subtitle}>Browse the directory and find a student.</Text>
        <TextInput style={styles.input} accessibilityLabel="Search students" placeholder="Search by name" value={search} onChangeText={setSearch} />
        {loading ? (
          <View style={styles.state}><ActivityIndicator color="#245bb2" /><Text style={styles.text}>Loading students...</Text></View>
        ) : error ? (
          <View style={styles.state} accessibilityLiveRegion="polite"><Text style={styles.error}>{error}</Text><Pressable accessibilityRole="button" onPress={() => setRetry(retry + 1)}><Text style={styles.link}>Try Again</Text></Pressable></View>
        ) : (
          <FlatList
            data={filteredStudents}
            keyExtractor={(item, index) => String(item.id ?? index)}
            renderItem={({ item }) => <StudentCard student={item} />}
            ListEmptyComponent={<View style={styles.state}><Text style={styles.text}>No students found.</Text></View>}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f2f5fa' },
  content: { flex: 1, width: '100%', maxWidth: 960, alignSelf: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#17324d', marginBottom: 8 },
  subtitle: { color: '#536579', fontSize: 14, marginBottom: 24, lineHeight: 22 },
  input: { padding: 16, borderWidth: 1, borderColor: '#d4deeb', borderRadius: 12, backgroundColor: '#ffffff', color: '#17324d', marginBottom: 20 },
  state: { padding: 24, gap: 12, alignItems: 'center' },
  text: { color: '#536579' },
  note: { color: '#536579', fontSize: 12 },
  error: { color: '#b42318' },
  link: { color: '#245bb2', padding: 12 },
});
