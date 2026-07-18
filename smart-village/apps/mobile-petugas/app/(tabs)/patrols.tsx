import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PatrolsScreen() {
  const patrols = [
    { id: '1', date: '2024-01-20', startTime: '08:00', endTime: '10:00', location: 'Kantor Desa', status: 'Selesai', photos: 3 },
    { id: '2', date: '2024-01-21', startTime: '14:00', endTime: '16:00', location: 'RW 03', status: 'Berlangsung', photos: 1 },
    { id: '3', date: '2024-01-22', startTime: '08:00', endTime: '-', location: 'RW 05', status: 'Dijadwalkan', photos: 0 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return '#10b981';
      case 'Berlangsung': return '#f59e0b';
      case 'Dijadwalkan': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Patroli Saya</Text>
        <Text style={styles.subtitle}>Riwayat patroli Anda</Text>
      </View>

      <View style={styles.list}>
        {patrols.map((patrol) => (
          <View key={patrol.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.location}>{patrol.location}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(patrol.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(patrol.status) }]}>
                  {patrol.status}
                </Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.dateText}>📅 {patrol.date}</Text>
              <Text style={styles.timeText}>🕐 {patrol.startTime} - {patrol.endTime}</Text>
              <Text style={styles.photosText}>📸 {patrol.photos} foto</Text>
            </View>
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
    marginBottom: 12,
  },
  location: {
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
  cardBody: {
    gap: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#374151',
  },
  timeText: {
    fontSize: 14,
    color: '#374151',
  },
  photosText: {
    fontSize: 14,
    color: '#374151',
  },
});
