import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';

export default function HomeScreen() {
  const { user } = useAuth();

  const services = [
    { id: '1', title: 'Surat Domisili', icon: '📄' },
    { id: '2', title: 'Surat Usaha', icon: '🏪' },
    { id: '3', title: 'Surat Tidak Mampu', icon: '💳' },
    { id: '4', title: 'Surat Kelahiran', icon: '👶' },
    { id: '5', title: 'Surat Kematian', icon: '🕊️' },
    { id: '6', title: 'Surat Pengantar SKCK', icon: '🔍' },
    { id: '7', title: 'Surat Nikah', icon: '💍' },
    { id: '8', title: 'Surat Ahli Waris', icon: '📋' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Halo, {user?.name || 'Warga'}! 👋</Text>
        <Text style={styles.subtitle}>Selamat datang di Smart Village</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Layanan Desa</Text>
        <View style={styles.grid}>
          {services.map((service) => (
            <Card key={service.id} style={styles.card}>
              <Text style={styles.cardIcon}>{service.icon}</Text>
              <Text style={styles.cardTitle}>{service.title}</Text>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 24,
    backgroundColor: '#1e40af',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#dbeafe',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    color: '#374151',
  },
});
