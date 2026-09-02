import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Linking } from 'react-native';

export default function ProfileScreen() {
  const openFacebook = () => {
    Linking.openURL('https://www.facebook.com/jonathan.delrosario.3538');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image 
          source={{ uri: 'https://storage.ghost.io/c/f6/74/f67486d4-268a-4fe4-b602-f2a61e3dfaab/content/images/2025/12/data-src-image-709b2b46-f7fc-40b5-a0e6-c9c57bd338cd.png' }} 
          style={styles.avatar} 
        />
        <Text style={styles.name}>Jonathan F Del Rosario</Text>
        <Text style={styles.title}>CCE106 </Text>
        
        <Text style={styles.bio}>
         Relive, React, Rene.
        </Text>

        <TouchableOpacity style={styles.button} onPress={openFacebook}>
          <Text style={styles.buttonText}>Connect on Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: 350,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007acc',
    marginBottom: 16,
  },
  bio: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1877f2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});