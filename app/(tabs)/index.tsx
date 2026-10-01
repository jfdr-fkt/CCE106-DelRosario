import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function HomeScreen() {
  const { token } = useAuth();

  return <Redirect href={token ? '/(app)' : '/sign-in'} />;
}
