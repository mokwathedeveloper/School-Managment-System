import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  Calendar, 
  Activity, 
  TrendingUp, 
  Users, 
  CreditCard, 
  ChevronRight,
  Clock,
  LayoutGrid
} from 'lucide-react-native';

export function AdminMobileView({ stats, router }: { stats: any, router: any }) {
  const quickActions = [
    { title: 'Registry', icon: Users, color: '#2563eb', route: '/(app)/index' },
    { title: 'Fees', icon: CreditCard, color: '#10b981', route: '/(app)/index' },
    { title: 'Schedule', icon: Calendar, color: '#8b5cf6', route: '/(app)/index' },
    { title: 'Metrics', icon: TrendingUp, color: '#f59e0b', route: '/(app)/index' },
  ];

  return (
    <View>
        {/* Primary Operational Card */}
        <TouchableOpacity activeOpacity={0.9} style={[styles.card, styles.primaryCard]}>
            <View style={styles.primaryCardHeader}>
                <View style={styles.statusChip}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Sync Active</Text>
                </View>
                <Activity size={18} color="#fff" opacity={0.6} />
            </View>
            <Text style={styles.cardValueWhite}>Institutional Inflow</Text>
            <Text style={styles.cardValueLargeWhite}>KES {stats?.totalInvoiced?.toLocaleString() || "0"}</Text>
        </TouchableOpacity>

        {/* Quick Action Grid */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Command Center</Text>
            <View style={styles.actionGrid}>
                {quickActions.map((action, i) => (
                    <TouchableOpacity key={i} style={styles.actionItem}>
                        <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                            <action.icon size={22} color={action.color} strokeWidth={2.5} />
                        </View>
                        <Text style={styles.actionLabel}>{action.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsRow}>
            <View style={[styles.card, styles.metricCard]}>
                <View style={styles.metricHeader}>
                    <Activity size={16} color="#2563eb" />
                    <Text style={styles.metricTrend}>Optimal</Text>
                </View>
                <Text style={styles.metricValue}>{stats?.overview?.attendanceRate || 0}%</Text>
                <Text style={styles.metricLabel}>Presence</Text>
            </View>
            <View style={[styles.card, styles.metricCard]}>
                <View style={styles.metricHeader}>
                    <Users size={16} color="#8b5cf6" />
                    <Text style={styles.metricTrend}>+2.4%</Text>
                </View>
                <Text style={styles.metricValue}>{stats?.overview?.totalStudents || 0}</Text>
                <Text style={styles.metricLabel}>Scholars</Text>
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  primaryCard: {
    backgroundColor: '#2563eb',
    padding: 24,
    marginBottom: 32,
    overflow: 'hidden',
  },
  primaryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ade80',
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardValueWhite: {
    color: '#bfdbfe',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardValueLargeWhite: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
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
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
    gap: 10,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  metricCard: {
    flex: 1,
    padding: 20,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTrend: {
    fontSize: 10,
    fontWeight: '900',
    color: '#10b981',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
});
