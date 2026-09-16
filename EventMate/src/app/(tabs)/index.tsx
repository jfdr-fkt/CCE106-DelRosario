import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import StatCard from '../../components/StatCard'; // Adjust path if your folder structure differs

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>EventMate</Text>
      <Text style={styles.welcome}>Welcome, Del Rosario!</Text>

      {/* Reusable StatCard components with props passed in */}
      <View style={styles.statsContainer}>
        <StatCard label="Total Events" value="12" />
        <StatCard label="Joined Events" value="3" />
        <StatCard label="Upcoming Events" value="5" />
      </View>

      {/* Navigation action to the Events tab */}
      <Link href="/events" style={styles.button}>
        <Text style={styles.buttonText}>Browse All Events</Text>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f4f4f4' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  welcome: { fontSize: 18, color: '#555', marginBottom: 20 },
  statsContainer: { marginBottom: 30 },
  button: {
    backgroundColor: '#0056b3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
});