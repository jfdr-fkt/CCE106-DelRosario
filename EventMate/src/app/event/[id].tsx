import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Reusing the same data to look up the event
const EVENT_DATA = [
  { id: '1', title: 'Tech Symposium 2026', category: 'Academics', datetime: 'Oct 12, 9:00 AM', venue: 'Main Hall', status: 'Available' },
  { id: '2', title: 'Inter-College Basketball', category: 'Sports', datetime: 'Oct 14, 3:00 PM', venue: 'Gymnasium', status: 'Joined' },
  { id: '3', title: 'Halloween Mixer', category: 'Social', datetime: 'Oct 31, 8:00 PM', venue: 'Student Center', status: 'Available' },
  { id: '4', title: 'React Native Workshop', category: 'Academics', datetime: 'Nov 5, 1:00 PM', venue: 'Lab 3', status: 'Available' },
  { id: '5', title: 'Esports Tournament', category: 'Sports', datetime: 'Nov 10, 10:00 AM', venue: 'Auditorium', status: 'Joined' },
];

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Find the matching event based on the URL parameter
  const event = EVENT_DATA.find((e) => e.id === id);

  // Local state to handle joining/leaving the event
  const [isJoined, setIsJoined] = useState(event?.status === 'Joined');

  // Handle the "invalid/not-found" state required by the instructions
  if (!event) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Oops! Event not found.</Text>
        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.category}>{event.category}</Text>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.details}>{event.datetime}</Text>
        <Text style={styles.details}>{event.venue}</Text>
        
        <View style={styles.divider} />
        
        <Pressable 
          style={[styles.primaryButton, isJoined ? styles.leaveButton : styles.joinButton]}
          onPress={() => setIsJoined(!isJoined)}
        >
          <Text style={styles.primaryButtonText}>
            {isJoined ? 'Leave Event' : 'Join Event'}
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
        <Text style={styles.secondaryButtonText}>Back to Events</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1C23',
    padding: 20,
    justifyContent: 'center',
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: '#1A1C23',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#2A2D34',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 20,
  },
  category: {
    color: '#4ECDC4',
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 14,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  details: {
    fontSize: 16,
    color: '#A0AEC0',
    fontWeight: '500',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#394053',
    marginVertical: 20,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#FF6B6B',
  },
  leaveButton: {
    backgroundColor: '#394053',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#A0AEC0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 20,
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginBottom: 20,
  },
});