import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, useWindowDimensions } from 'react-native';
import EventCard from '../../components/EventCard';

const EVENT_DATA = [
  { id: '1', title: 'Tech Symposium 2026', category: 'Academics', datetime: 'Oct 12, 9:00 AM', venue: 'Main Hall', status: 'Available' },
  { id: '2', title: 'Inter-College Basketball', category: 'Sports', datetime: 'Oct 14, 3:00 PM', venue: 'Gymnasium', status: 'Joined' },
  { id: '3', title: 'Halloween Mixer', category: 'Social', datetime: 'Oct 31, 8:00 PM', venue: 'Student Center', status: 'Available' },
  { id: '4', title: 'React Native Workshop', category: 'Academics', datetime: 'Nov 5, 1:00 PM', venue: 'Lab 3', status: 'Available' },
  { id: '5', title: 'Esports Tournament', category: 'Sports', datetime: 'Nov 10, 10:00 AM', venue: 'Auditorium', status: 'Joined' },
];

export default function Events() {
  const [filter, setFilter] = useState('All');
  const { width } = useWindowDimensions();

  const filteredEvents = filter === 'All' 
    ? EVENT_DATA 
    : EVENT_DATA.filter(e => e.category === filter);

  const renderFilter = (category: string) => (
    <Pressable 
      key={category}
      style={[styles.filterBtn, filter === category && styles.filterBtnActive]}
      onPress={() => setFilter(category)}
    >
      <Text style={[styles.filterText, filter === category && styles.filterTextActive]}>
        {category}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Discover</Text>
      
      <View style={styles.filterContainer}>
        {['All', 'Academics', 'Sports', 'Social'].map(renderFilter)}
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard {...item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1C23',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    padding: 20,
    paddingBottom: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 10,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 25,
    backgroundColor: '#2A2D34',
  },
  filterBtnActive: {
    backgroundColor: '#FF6B6B',
  },
  filterText: {
    color: '#A0AEC0',
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
});