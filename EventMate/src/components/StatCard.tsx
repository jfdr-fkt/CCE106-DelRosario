import { View, Text, StyleSheet } from 'react-native';


interface StatCardProps {
  label: string;
  value: string | number;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  value: { fontSize: 24, fontWeight: 'bold', color: '#0056b3' },
  label: { fontSize: 16, color: '#333', marginTop: 5 },
});