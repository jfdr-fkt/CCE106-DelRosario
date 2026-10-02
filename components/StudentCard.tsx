import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export type Student = {
  id: number;
  name: string;
  email: string;
  username?: string;
  phone?: string;
  address?: { city?: string };
  company?: { name?: string };
};

export default function StudentCard({ student }: { student: Student }) {
  const router = useRouter();

  const handleViewDetails = () => {
    if (student.id === undefined || student.id === null || String(student.id).trim() === '') {
      return;
    }

    router.push({ pathname: '/student/[id]', params: { id: String(student.id) } });
  };

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.avatar}><Text style={styles.initial}>{student.name?.charAt(0).toUpperCase() || '?'}</Text></View>
        <View style={styles.info}>
          <Text style={styles.name}>{student.name || 'Name not available'}</Text>
          <Text style={styles.text}>{student.email || 'Email not available'}</Text>
        </View>
      </View>
      <View style={styles.bottom}>
        {student.company?.name ? <Text style={styles.company}>{student.company.name}</Text> : null}
        <Pressable accessibilityRole="button" accessibilityLabel="View Details" style={styles.button} onPress={handleViewDetails} disabled={student.id === undefined || student.id === null || String(student.id).trim() === ''}>
          <Text style={styles.buttonText}>View Details</Text>
          <Ionicons name="arrow-forward" size={16} color="#245bb2" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, borderRadius: 16, backgroundColor: '#ffffff', marginBottom: 12, gap: 16, borderWidth: 1, borderColor: '#e1e7ef' },
  top: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#edf3ff', alignItems: 'center', justifyContent: 'center' },
  initial: { fontSize: 20, fontWeight: '700', color: '#245bb2' },
  info: { flex: 1, gap: 6 },
  name: { color: '#17324d', fontSize: 18, fontWeight: '600' },
  text: { color: '#536579' },
  bottom: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTopWidth: 1, borderTopColor: '#edf0f5', paddingTop: 12 },
  company: { color: '#536579', fontSize: 12, flexShrink: 1 },
  button: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#edf3ff' },
  buttonText: { color: '#245bb2', fontWeight: '600' },
});
