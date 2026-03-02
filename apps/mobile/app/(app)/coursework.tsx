import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Clock, CheckCircle2 } from 'lucide-react-native';

export default function CourseworkScreen() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoursework = async () => {
    try {
      // In a real scenario, we might need classId, but let's assume an endpoint
      // that returns assignments for the current student's class
      const res = await api.get('/lms/assignments'); 
      setAssignments(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursework();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <BookOpen size={20} stroke="#2563eb" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.subject}>{item.subject?.name || 'General Registry'}</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.meta}>
          <Clock size={14} stroke="#64748b" />
          <Text style={styles.metaText}>Due: {new Date(item.due_date).toLocaleDateString()}</Text>
        </View>
        <View style={[styles.badge, item.submissions?.length > 0 ? styles.badgeSuccess : styles.badgePending]}>
          <Text style={[styles.badgeText, item.submissions?.length > 0 ? styles.badgeTextSuccess : styles.badgeTextPending]}>
            {item.submissions?.length > 0 ? 'Submitted' : 'Pending'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Coursework</Text>
        <Text style={styles.headerSubtitle}>Active Assignments & Tasks</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={assignments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onRefresh={fetchCoursework}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No assignments found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  list: {
    padding: 24,
    paddingTop: 0,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  subject: {
    fontSize: 10,
    fontWeight: '900',
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
    paddingTop: 16,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginLeft: 6,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgePending: {
    backgroundColor: '#fff7ed',
  },
  badgeSuccess: {
    backgroundColor: '#f0fdf4',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  badgeTextPending: {
    color: '#ea580c',
  },
  badgeTextSuccess: {
    color: '#16a34a',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8',
  }
});
