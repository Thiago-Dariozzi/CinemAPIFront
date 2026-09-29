import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';

// Cambiá esta URL por la de tu servidor
const BASE_URL = 'http://10.0.2.2:5000'; // 10.0.2.2 = localhost del emulador Android

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Completá email y contraseña');
      return;
    }

    setLoading(true);

    fetch(`${BASE_URL}/api/user/email/${email}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Usuario no encontrado');
        }
        return res.json();
      })
      .then((data) => {
        // Por ahora validamos que el usuario exista
        // Cuando agreguen JWT, acá iría el POST a /api/auth/login
        setUser(data);
        Alert.alert('Bienvenido', `Hola ${data.name}!`);
      })
      .catch((err) => {
        Alert.alert('Error', err.message || 'No se pudo conectar al servidor');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
  };

  // Si ya está logueado, mostrar pantalla de bienvenida
  if (user) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeIcon}>🎬</Text>
          <Text style={styles.welcomeTitle}>CinemAPI</Text>
          <Text style={styles.welcomeText}>Hola, {user.name}!</Text>
          <Text style={styles.welcomeRole}>{user.role}</Text>
          <Text style={styles.welcomeEmail}>{user.email}</Text>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Pantalla de login
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.loginCard}>
        <Text style={styles.logo}>🎬</Text>
        <Text style={styles.title}>CinemAPI</Text>
        <Text style={styles.subtitle}>Iniciá sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.loginButtonPressed,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          )}
        </Pressable>

        <Pressable style={styles.registerLink} onPress={() => Alert.alert('Info', 'Próximamente: registro')}>
          <Text style={styles.registerLinkText}>
            ¿No tenés cuenta? <Text style={styles.registerLinkBold}>Registrate</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loginCard: {
    width: '100%',
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  logo: {
    fontSize: 50,
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 5,
  },
  loginButtonPressed: {
    backgroundColor: '#c73652',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
  },
  registerLinkText: {
    color: '#888',
    fontSize: 14,
  },
  registerLinkBold: {
    color: '#e94560',
    fontWeight: 'bold',
  },
  // Welcome screen
  welcomeCard: {
    width: '100%',
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  welcomeIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  welcomeRole: {
    fontSize: 14,
    color: '#e94560',
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  welcomeEmail: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
