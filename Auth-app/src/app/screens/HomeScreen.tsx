import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, ScrollView, Image, Alert } from 'react-native';

type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  phone?: string;
  address?: { city?: string };
};

type Post = {
  id: number;
  title: string;
  body: string;
};

type Props = {
  token: string;
  onLogout: () => void;
};

export default function HomeScreen({ token, onLogout }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://dummyjson.com/auth/me', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (res.status === 401) {
        onLogout();
        return;
      }
      if (!res.ok) throw new Error('bad response');
      const data: User = await res.json();
      setUser(data);
      const postsRes = await fetch('https://dummyjson.com/posts/user/' + data.id);
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData.posts);
      }
    } catch {
      setError('Could not load your dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const confirmLogout = () => {
    Alert.alert('Logout', 'End this session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: onLogout },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#123a6b" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      ) : error ? (
        <View style={styles.card}>
          <Text style={styles.error}>{error}</Text>
          <View style={styles.button}>
            <Button title="Try Again" onPress={loadDashboard} />
          </View>
        </View>
      ) : user ? (
        <View>
          <View style={styles.header}>
            {user.image ? (
              <Image source={{ uri: user.image }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{user.firstName.charAt(0)}</Text>
              </View>
            )}
            <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>@{user.username}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Details</Text>
            <Text style={styles.line}>City: {user.address?.city ?? '—'}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Session</Text>
            <Text style={styles.line}>Status: Active</Text>
            <Text style={styles.line} numberOfLines={1}>Token: {token.slice(0, 10)}...{token.slice(-4)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Posts</Text>
            {posts.length === 0 ? (
              <Text style={styles.line}>No posts yet.</Text>
            ) : (
              posts.slice(0, 3).map((post) => (
                <View key={post.id} style={styles.post}>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postBody} numberOfLines={2}>{post.body}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.button}>
            <Button title="Refresh" onPress={loadDashboard} />
          </View>
          <View style={styles.button}>
            <Button title="Logout" color="#dc2626" onPress={confirmLogout} />
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    alignItems: 'center',
    marginTop: 120,
  },
  loadingText: {
    marginTop: 12,
    color: '#334155',
  },
  header: {
    backgroundColor: '#123a6b',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 12,
  },
  avatarFallback: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '700',
  },
  name: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  email: {
    color: '#bfdbfe',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 10,
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#123a6b',
    marginBottom: 10,
  },
  line: {
    color: '#334155',
    marginBottom: 6,
  },
  post: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    marginTop: 6,
  },
  postTitle: {
    fontWeight: '600',
    color: '#0f172a',
  },
  postBody: {
    color: '#64748b',
    marginTop: 4,
  },
  error: {
    color: '#dc2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginBottom: 10,
  },
});