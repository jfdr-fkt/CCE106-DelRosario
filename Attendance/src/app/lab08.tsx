import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const names = [
  'Philip Pines',
  'Rene Baterbonia',
  'Charlie Kirk',
  'Caryl Niggasca',
  'Wojtekk',
  'Carlos Yulo',
  'Pickle Ball',
  'Martin Romualdez',
  'Bituin Ng Mindanao',
  'Harambe',
];

export default function Lab08() {
  const [status, setStatus] = useState(names.map(() => ''));
  const [index, setIndex] = useState(0);
  const [summary, setSummary] = useState('Present: 0, Absent: 0');

  useEffect(() => {
    const present = status.filter((s) => s === 'Present').length;
    const absent = status.filter((s) => s === 'Absent').length;
    setSummary('Present: ' + present + ', Absent: ' + absent);
  }, [status]);

  const mark = (value: string) => {
    if (index >= names.length) {
      return;
    }
    const next = [...status];
    next[index] = value;
    setStatus(next);
    setIndex(index + 1);
  };

  const restart = () => {
    setStatus(names.map(() => ''));
    setIndex(0);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Attendance List</Text>

      <View style={styles.bigButtons}>
        <TouchableOpacity style={styles.presentButton} onPress={() => mark('Present')}>
          <Text style={styles.bigButtonText}>P</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.absentButton} onPress={() => mark('Absent')}>
          <Text style={styles.bigButtonText}>A</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.headerName}>Names</Text>
        <Text style={styles.headerCol}>P</Text>
        <Text style={styles.headerCol}>A</Text>
      </View>

      {names.map((name, i) => (
        <View key={name} style={[styles.row, i === index && styles.currentRow]}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.col}>
            <View style={[styles.checkbox, status[i] === 'Present' && styles.checkboxPresent]}>
              <Text style={styles.checkboxText}>{status[i] === 'Present' ? '✓' : ''}</Text>
            </View>
          </View>
          <View style={styles.col}>
            <View style={[styles.checkbox, status[i] === 'Absent' && styles.checkboxAbsent]}>
              <Text style={styles.checkboxText}>{status[i] === 'Absent' ? '✓' : ''}</Text>
            </View>
          </View>
        </View>
      ))}

      <Text style={styles.summary}>{summary}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  bigButtons: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  presentButton: {
    backgroundColor: 'green',
    flex: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    borderRadius: 10,
  },
  absentButton: {
    backgroundColor: 'red',
    flex: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    borderRadius: 10,
  },
  bigButtonText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    marginBottom: 6,
  },
  headerName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerCol: {
    width: 40,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  currentRow: {
    borderColor: 'blue',
    borderWidth: 2,
  },
  name: {
    flex: 1,
    fontSize: 18,
  },
  col: {
    width: 40,
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#555555',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxPresent: {
    backgroundColor: 'green',
    borderColor: 'green',
  },
  checkboxAbsent: {
    backgroundColor: 'red',
    borderColor: 'red',
  },
  checkboxText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summary: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 30,
  },
restartButton: {
  alignSelf: 'center',
  marginTop: 12,
  paddingHorizontal: 16,
  paddingVertical: 6,
  borderWidth: 1,
  borderColor: '#999999',
  borderRadius: 6,
},
restartText: {
  color: '#666666',
  fontSize: 14,
},
});