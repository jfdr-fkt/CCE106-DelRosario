import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  const increaseCount = () => {
    setCount(count + 1);
  };

  const decreaseCount = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const resetCount = () => {
    setCount(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter App</Text>

      <View style={styles.box}>
        <Text style={styles.numberText}>{count}</Text>
      </View>

      <TouchableOpacity style={styles.buttonGreen} onPress={increaseCount}>
        <Text style={styles.buttonText}>Increase</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOrange} onPress={decreaseCount}>
        <Text style={styles.buttonText}>Decrease</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonBlue} onPress={resetCount}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  box: {
    borderWidth: 1,
    padding: 40,
    marginBottom: 20,
  },
  numberText: {
    fontSize: 50,
  },
  buttonGreen: {
    backgroundColor: 'green',
    padding: 15,
    width: 200,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonOrange: {
    backgroundColor: 'orange',
    padding: 15,
    width: 200,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonBlue: {
    backgroundColor: 'blue',
    padding: 15,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});