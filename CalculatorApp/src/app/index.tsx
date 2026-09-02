import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function App() {
  const [firstNumber, setFirstNumber] = useState('');
  const [secondNumber, setSecondNumber] = useState('');
  const [result, setResult] = useState('Result: ');

  const addNumbers = () => {
    if (firstNumber === '' || secondNumber === '') {
      setResult('Error: Inputs cannot be empty');
    } else {
      const num1 = parseFloat(firstNumber);
      const num2 = parseFloat(secondNumber);
      const total = num1 + num2;
      setResult('Result: ' + total);
    }
  };

  const subtractNumbers = () => {
    if (firstNumber === '' || secondNumber === '') {
      setResult('Error: Inputs cannot be empty');
    } else {
      const num1 = parseFloat(firstNumber);
      const num2 = parseFloat(secondNumber);
      const total = num1 - num2;
      setResult('Result: ' + total);
    }
  };

  const multiplyNumbers = () => {
    if (firstNumber === '' || secondNumber === '') {
      setResult('Error: Inputs cannot be empty');
    } else {
      const num1 = parseFloat(firstNumber);
      const num2 = parseFloat(secondNumber);
      const total = num1 * num2;
      setResult('Result: ' + total);
    }
  };

  const divideNumbers = () => {
    if (firstNumber === '' || secondNumber === '') {
      setResult('Error: Inputs cannot be empty');
    } else if (secondNumber === '0') {
      setResult('Error: Cannot divide by zero');
    } else {
      const num1 = parseFloat(firstNumber);
      const num2 = parseFloat(secondNumber);
      const total = num1 / num2;
      setResult('Result: ' + total);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple Calculator</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={firstNumber}
          onChangeText={setFirstNumber}
        />
        <TextInput
          style={styles.input}
          value={secondNumber}
          onChangeText={setSecondNumber}
        />
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={addNumbers}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={subtractNumbers}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={multiplyNumbers}>
          <Text style={styles.buttonText}>*</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={divideNumbers}>
          <Text style={styles.buttonText}>/</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>{result}</Text>
      </View>
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
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    width: 100,
    height: 50,
    marginHorizontal: 10,
    textAlign: 'center',
    fontSize: 20,
  },
  button: {
    backgroundColor: 'lightblue',
    width: 50,
    height: 50,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 24,
  },
  resultBox: {
    borderWidth: 1,
    width: 250,
    padding: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
  }
});