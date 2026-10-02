import Constants from 'expo-constants';
import { Platform } from 'react-native';

const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];
const host = Platform.OS === 'web' && typeof window !== 'undefined'
  ? window.location.hostname
  : expoHost || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || `http://${host}:3000`).replace(/\/$/, '');

// Expected endpoints:
// POST /login
// GET /students
// GET /students/{id}
// GET /profile
// TODO EXAM: Confirm request/response fields against the instructor's API documentation.
