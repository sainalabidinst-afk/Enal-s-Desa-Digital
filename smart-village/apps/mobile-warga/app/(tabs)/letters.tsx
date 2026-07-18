import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function LettersScreen() {
  const { user } = useAuth();

  const letters = [
    { id: '1', type: 'Surat Domisili', number: 'DOM/2024/01/0001', status: 'Selesai', date: '2024-01-15' },
    { id: '2', type: 'Surat Usaha', number: 'USA/2024/01/0002', status: 'Diproses', date: '2024-01-18' },
    { id: '3', type: 'Surat Tidak Mampu', number: 'STM/2024/01/0003', status: 'Menunggu', date: '2024-01-20' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return '#10b981';
      case 'Diproses': return '#f59e0b';
      case 'Menunggu': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daftar Surat</Text>
        <Text style={styles.subtitle}>Riwayat pengajuan surat Anda</Text>
      </View>

      <View style={styles.list}>
        {letters.map((letter) => (
          <View key={letter.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.letterType}>{letter.type}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(letter.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(letter.status) }]}>
                  {letter.status}
                </Text>
              </View>
            </View>
            <Text style={styles.letterNumber}>{letter.number}</Text>
            <Text style={styles.letterDate}>Tanggal: {letter.date}</Text>
          </View>
        ))}
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  letterType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  letterNumber: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  letterDate: {
    fontSize: 12,
    color: '#6b7280',
  },
});
