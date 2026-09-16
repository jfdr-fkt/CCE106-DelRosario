import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image } from 'react-native';

export default function Profile() {
  const [name, setName] = useState('Del Rosario');
  const [email, setEmail] = useState('student@campus.edu');
  const [statusMsg, setStatusMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSave = () => {
    // Validation
    if (name.trim() === '') {
      setIsError(true);
      setStatusMsg('Name cannot be empty.');
      return;
    }
    
    if (!email.includes('@') || email.trim() === '') {
      setIsError(true);
      setStatusMsg('Please enter a valid email address.');
      return;
    }

    // Success state
    setIsError(false);
    setStatusMsg('Profile saved successfully!');
    
    // Clear the success message after 3 seconds
    setTimeout(() => setStatusMsg(''), 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Profile</Text>

      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: 'https://api.dicebear.com/9.x/avataaars/png?seed=DelRosario' }} 
          style={styles.avatar} 
        />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          placeholderTextColor="#A0AEC0"
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#A0AEC0"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Conditional rendering for error/success message */}
        {statusMsg !== '' && (
          <Text style={[styles.statusText, isError ? styles.errorText : styles.successText]}>
            {statusMsg}
          </Text>
        )}

        <Pressable 
          style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]} 
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1C23',
    padding: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2A2D34',
    borderWidth: 3,
    borderColor: '#4ECDC4',
  },
  form: {
    backgroundColor: '#2A2D34',
    padding: 20,
    borderRadius: 16,
  },
  label: {
    color: '#4ECDC4',
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#1A1C23',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#394053',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusText: {
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: '#FF6B6B',
  },
  successText: {
    color: '#4ECDC4',
  },
});