import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../hooks/useAuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { 
  ChevronRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Role Views
import { AdminMobileView } from '../../components/dashboard/role-views/AdminMobileView';
import { TeacherMobileView } from '../../components/dashboard/role-views/TeacherMobileView';
import { SpecialistMobileView } from '../../components/dashboard/role-views/SpecialistMobileView';
import { StaffMobileView } from '../../components/dashboard/role-views/StaffMobileView';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [schoolRes, statsRes] = await Promise.all([
        api.get('/schools/my-school'),
        api.get('/analytics/dashboard')
      ]);
      setStats({
        school: schoolRes.data,
        ...statsRes.data
      });
    } catch (error) {
      console.error('Dashboard fetch failed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const renderRoleView = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
      case 'SCHOOL_ADMIN':
      case 'HEAD_TEACHER':
      case 'DEPUTY_HEAD_TEACHER':
      case 'ACCOUNTANT':
        return <AdminMobileView stats={stats} router={router} />;
      case 'TEACHER':
      case 'CLASS_TEACHER':
        return <TeacherMobileView stats={stats} router={router} />;
      case 'LIBRARIAN':
      case 'NURSE':
      case 'MATRON':
      case 'SECURITY':
      case 'DRIVER':
        return <SpecialistMobileView user={user} stats={stats} />;
      default:
        return <StaffMobileView stats={stats} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />
        }
      >
        {/* Institutional Header */}
        <View style={styles.topBar}>
            <View>
                <Text style={styles.schoolName}>{stats?.school?.name || 'SchoolOS'}</Text>
                <Text style={styles.greeting}>Terminal v1.0</Text>
            </View>
            <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/(app)/profile')}>
                <View style={styles.avatarMini}>
                    <Text style={styles.avatarTextMini}>{user?.first_name?.[0]}{user?.last_name?.[0]}</Text>
                </View>
            </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.nameLabel}>Hello, {user?.first_name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role?.replace('_', ' ')}</Text>
          </View>
        </View>

        {/* Dynamic Content */}
        {renderRoleView()}

        {/* Global Institutional Pulse */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Institutional Pulse</Text>
          <TouchableOpacity style={styles.pulseCard}>
            <View style={styles.pulseInfo}>
                <Text style={styles.pulseLabel}>System Integrity</Text>
                <Text style={styles.pulseStatus}>Node Operational</Text>
            </View>
            <View style={styles.pulseRight}>
                <View style={styles.pulseIndicator} />
                <ChevronRight size={16} color="#94a3b8" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  schoolName: {
    fontSize: 10,
    fontWeight: '900',
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  greeting: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    marginTop: 2,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTextMini: {
    fontSize: 12,
    fontWeight: '900',
    color: '#2563eb',
  },
  welcomeSection: {
    marginBottom: 24,
  },
  nameLabel: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  roleBadge: {
    backgroundColor: '#e0e7ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  roleText: {
    color: '#2563eb',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  pulseCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  pulseInfo: {
    gap: 4,
  },
  pulseLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pulseStatus: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
  },
  pulseRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pulseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
