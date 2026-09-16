import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

interface EventCardProps {
  id: string;
  title: string;
  category: string;
  datetime: string;
  venue: string;
  status: string;
}

export default function EventCard({ id, title, category, datetime, venue, status }: EventCardProps) {
  return (
    <Link href={{ pathname: "/event/[id]", params: { id } }} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        <View style={styles.header}>
          <Text style={styles.category}>{category}</Text>
          <Text style={[styles.status, status === 'Joined' ? styles.joined : styles.available]}>
            {status}
          </Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.details}>{datetime} • {venue}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2A2D34',
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
    borderLeftWidth: 6,
    borderLeftColor: '#FF6B6B',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  category: {
    color: '#4ECDC4',
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  available: {
    backgroundColor: '#394053',
    color: '#A0AEC0',
  },
  joined: {
    backgroundColor: '#4ECDC4',
    color: '#1A1C23',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  details: {
    fontSize: 14,
    color: '#A0AEC0',
    fontWeight: '500',
  },
});