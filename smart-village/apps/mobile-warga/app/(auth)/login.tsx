import { Link } from 'expo-router';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const [nik, setNIK] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!nik || !password) {
      Alert.alert('Error', 'NIK dan password harus diisi');
      return;
    }

    setIsLoading(true);
    try {
      await login(nik, password);
    } catch (error) {
      Alert.alert('Error', 'Login gagal. Periksa kembali NIK dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Smart Village</Text>
        <Text style={styles.subtitle}>Masuk untuk mengakses layanan desa</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="NIK"
            value={nik}
            onChangeText={setNIK}
            autoCapitalize="none"
            keyboardType="numeric"
            maxLength={16}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title={isLoading ? 'Memuat...' : 'Masuk'}
            onPress={handleLogin}
            disabled={isLoading}
          />
        </View>

        <Text style={styles.footer}>
          Belum memiliki akun?{' '}
          <Text style={styles.link}>Hubungi Desa</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1e40af',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#6b7280',
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  footer: {
    textAlign: 'center',
    marginTop: 24,
    color: '#6b7280',
  },
  link: {
    color: '#1e40af',
    fontWeight: '600',
  },
});
