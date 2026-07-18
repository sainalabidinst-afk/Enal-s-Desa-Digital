import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';

export default function ComplaintsScreen() {
  const [complaints] = useState([
    { id: '1', subject: 'Jalan Rusak di RT 03', status: 'Diproses', date: '2024-01-15', category: 'Infrastruktur' },
    { id: '2', subject: 'Lampu Jalan Mati', status: 'Selesai', date: '2024-01-10', category: 'Infrastruktur' },
  ]);

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
        <Text style={styles.title}>Pengaduan Saya</Text>
        <Text style={styles.subtitle}>Lacak status pengaduan Anda</Text>
      </View>

      <View style={styles.list}>
        {complaints.map((complaint) => (
          <View key={complaint.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.category}>{complaint.category}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(complaint.status) }]}>
                  {complaint.status}
                </Text>
              </View>
            </View>
            <Text style={styles.subject}>{complaint.subject}</Text>
            <Text style={styles.date}>Tanggal: {complaint.date}</Text>
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
  category: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
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
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
});
