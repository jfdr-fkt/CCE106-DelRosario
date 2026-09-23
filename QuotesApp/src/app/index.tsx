import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';

type Quote = {
  id: number;
  quote: string;
  author: string;
};

export default function App() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://dummyjson.com/quotes/random');
      if (!res.ok) throw new Error('bad response');
      const data: Quote = await res.json();
      setQuote(data);
    } catch {
      setQuote(null);
      setError('Could not load a quote. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuote();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>QUOTE OF THE DAY</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0ea5e9" style={styles.space} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : quote ? (
          <View>
            <Text style={styles.quote}>"{quote.quote}"</Text>
            <Text style={styles.author}>— {quote.author}</Text>
          </View>
        ) : (
          <Text style={styles.empty}>No quote yet. Tap New Quote.</Text>
        )}
        <View style={styles.button}>
          <Button title="New Quote" onPress={getQuote} disabled={loading} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#123a6b',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 420,
    minHeight: 340,
  },
  title: {
    color: '#7dd3fc',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 20,
  },
  quote: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  author: {
    color: '#fcd34d',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  error: {
    color: '#fca5a5',
    textAlign: 'center',
    marginBottom: 24,
  },
  empty: {
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 24,
  },
  space: {
    marginBottom: 24,
  },
  button: {
    width: '70%',
  },
});