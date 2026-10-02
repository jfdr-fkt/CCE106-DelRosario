import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardScreen() {
  const { token, user } = useAuth();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.brandIcon}><Ionicons name="school-outline" size={26} color="#ffffff" /></View>
            <Text style={styles.eyebrow}>STUDENT SERVICE PORTAL</Text>
          </View>
          <Text style={styles.title}>Welcome, {user?.name || 'Student'}</Text>
          <Text style={styles.heroText}>Your student services in one place.</Text>
        </View>
        <Text style={styles.heading}>Quick Actions</Text>
        <View style={styles.actions}>
          <Link href="/(app)/students" asChild>
            <Pressable accessibilityRole="button" accessibilityLabel="View Students" style={styles.actionCard}>
              <View style={styles.studentIcon}><Ionicons name="people-outline" size={26} color="#245bb2" /></View>
              <Text style={styles.actionTitle}>Student Directory</Text>
              <Text style={styles.subtitle}>Find students and view their contact details.</Text>
              <View style={styles.actionLink}><Text style={styles.link}>View Students</Text><Ionicons name="arrow-forward" size={18} color="#245bb2" /></View>
            </Pressable>
          </Link>
          <Link href="/(app)/profile" asChild>
            <Pressable accessibilityRole="button" accessibilityLabel="My Profile" style={styles.actionCard}>
              <View style={styles.profileIcon}><Ionicons name="person-outline" size={26} color="#8b5b15" /></View>
              <Text style={styles.actionTitle}>Your Account</Text>
              <Text style={styles.subtitle}>View your profile and manage your session.</Text>
              <View style={styles.actionLink}><Text style={styles.link}>My Profile</Text><Ionicons name="arrow-forward" size={18} color="#245bb2" /></View>
            </Pressable>
          </Link>
        </View>
        <View style={styles.session}>
          <View style={styles.sessionIcon}><Ionicons name="shield-checkmark-outline" size={23} color="#28734b" /></View>
          <View style={styles.sessionText}>
            <Text style={styles.sessionTitle}>Session Status</Text>
            <Text style={styles.subtitle}>You can access your student services.</Text>
          </View>
          <Text style={styles.badge}>{token ? 'Authenticated' : 'Not Available'}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f2f5fa' },
  content: { width: '100%', maxWidth: 960, alignSelf: 'center', gap: 20 },
  hero: { backgroundColor: '#245bb2', borderRadius: 20, padding: 28, gap: 14 },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandIcon: { padding: 10, borderRadius: 14, backgroundColor: '#3e70bd' },
  eyebrow: { color: '#e0eaff', fontSize: 11, fontWeight: '700', letterSpacing: 1, flexShrink: 1 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700' },
  heroText: { color: '#e0eaff', fontSize: 16, lineHeight: 24 },
  subtitle: { color: '#536579', fontSize: 14, lineHeight: 22 },
  heading: { color: '#17324d', fontSize: 20, fontWeight: '700', marginTop: 8 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  actionCard: { flexGrow: 1, flexBasis: 260, padding: 24, gap: 12, backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#e1e7ef' },
  studentIcon: { padding: 12, backgroundColor: '#edf3ff', borderRadius: 14, alignSelf: 'flex-start' },
  profileIcon: { padding: 12, backgroundColor: '#fff3dd', borderRadius: 14, alignSelf: 'flex-start' },
  actionTitle: { color: '#17324d', fontSize: 20, fontWeight: '600' },
  actionLink: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  link: { color: '#245bb2', fontWeight: '700', fontSize: 14 },
  session: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', padding: 20, gap: 14, borderRadius: 16, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e1e7ef' },
  sessionIcon: { padding: 10, borderRadius: 12, backgroundColor: '#eaf6ef' },
  sessionText: { flexGrow: 1, flexBasis: 220, gap: 4 },
  sessionTitle: { color: '#17324d', fontSize: 15, fontWeight: '600' },
  badge: { color: '#28734b', fontSize: 12, fontWeight: '600', backgroundColor: '#eaf6ef', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
});
