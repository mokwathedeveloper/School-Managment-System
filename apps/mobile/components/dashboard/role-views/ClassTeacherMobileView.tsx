import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  Users, 
  CheckCircle, 
  BookOpen, 
  AlertCircle,
  MessageSquare
} from 'lucide-react-native';

export function ClassTeacherMobileView({ stats, router }: { stats: any, router: any }) {
  const quickActions = [
    { title: 'My Class', Icon: Users, color: '#2563eb', route: '/(app)/index' },
    { title: 'Attendance', Icon: CheckCircle, color: '#10b981', route: '/(app)/index' },
    { title: 'Subjects', Icon: BookOpen, color: '#8b5cf6', route: '/(app)/index' },
    { title: 'Chat', Icon: MessageSquare, color: '#f59e0b', route: '/(app)/index' },
  ];

  return (
    <View>
        <TouchableOpacity activeOpacity={0.9} style={[styles.card, styles.primaryCard]}>
            <View style={styles.primaryCardHeader}>
                <View style={styles.statusChip}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Class Node: 10 North</Text>
                </View>
                <Users size={18} color="#fff" />
            </View>
            <Text style={styles.cardValueWhite}>Class Presence</Text>
            <Text style={styles.cardValueLargeWhite}>96.4%</Text>
        </TouchableOpacity>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scholar Management</Text>
            <View style={styles.actionGrid}>
                {quickActions.map((action, i) => {
                    const Icon = action.Icon;
                    return (
                        <TouchableOpacity key={i} style={styles.actionItem} onPress={() => router.push(action.route as any)}>
                            <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                                <Icon size={22} color={action.color} strokeWidth={2.5} />
                            </View>
                            <Text style={styles.actionLabel}>{action.title}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>

        <View style={styles.metricsRow}>
            <View style={[styles.card, styles.metricCard]}>
                <View style={styles.metricHeader}>
                    <AlertCircle size={16} color="#ef4444" />
                    <Text style={[styles.metricTrend, { color: '#ef4444' }]}>Action</Text>
                </View>
                <Text style={styles.metricValue}>3</Text>
                <Text style={styles.metricLabel}>Alerts</Text>
            </View>
            <View style={[styles.card, styles.metricCard]}>
                <View style={styles.metricHeader}>
                    <BookOpen size={16} color="#2563eb" />
                    <Text style={styles.metricTrend}>Active</Text>
                </View>
                <Text style={styles.metricValue}>6</Text>
                <Text style={styles.metricLabel}>Lessons Today</Text>
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
    backgroundColor: '#3b82f6',
    padding: 24,
    marginBottom: 32,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardValueWhite: {
    color: '#dbeafe',
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
