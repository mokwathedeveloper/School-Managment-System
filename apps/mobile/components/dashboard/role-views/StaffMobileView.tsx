import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  Briefcase, 
  Activity,
  History,
  Bell
} from 'lucide-react-native';

export function StaffMobileView({ stats }: { stats: any }) {
  return (
    <View>
        {/* Primary Operational Card */}
        <TouchableOpacity activeOpacity={0.9} style={[styles.card, styles.primaryCard]}>
            <View style={styles.primaryCardHeader}>
                <View style={styles.statusChip}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Check-in Active</Text>
                </View>
                <Briefcase size={18} color="#fff" />
            </View>
            <Text style={styles.cardValueWhite}>Shift Manifest</Text>
            <Text style={styles.cardValueLargeWhite}>07:45 - 16:30</Text>
        </TouchableOpacity>

        {/* Section */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Institutional Pulse</Text>
            <View style={styles.actionCard}>
                <View style={styles.actionInfo}>
                    <Bell size={20} color="#2563eb" />
                    <Text style={styles.actionText}>Latest Announcements</Text>
                </View>
                <Text style={styles.countBadge}>3</Text>
            </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsRow}>
            <View style={[styles.card, styles.metricCard]}>
                <View style={styles.metricHeader}>
                    <Activity size={16} color="#2563eb" />
                </View>
                <Text style={styles.metricValue}>100%</Text>
                <Text style={styles.metricLabel}>Punctuality</Text>
            </View>
            <View style={[styles.card, styles.metricCard]}>
                <View style={styles.metricHeader}>
                    <History size={16} color="#8b5cf6" />
                </View>
                <Text style={styles.metricValue}>22</Text>
                <Text style={styles.metricLabel}>Days Logged</Text>
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
  actionCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
  },
  countBadge: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
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
