import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import type { HCVStatus } from '../../store/intakeStore';

const REJECTION_REASONS: Record<string, string> = {
  '72': 'Card number not on file',
  '73': 'Card has expired',
  '74': 'Invalid version code',
};

interface Props {
  status: HCVStatus;
  responseCode?: string;
}

export function HCVStatusBadge({ status, responseCode }: Props) {
  if (status === 'idle') return null;

  if (status === 'pending') {
    return (
      <View style={[styles.row, styles.pendingBg]}>
        <ActivityIndicator size="small" color="#64748b" />
        <Text style={styles.pendingText}>Validating...</Text>
      </View>
    );
  }

  if (status === 'valid') {
    return (
      <View style={[styles.row, styles.successBg]}>
        <Text style={styles.successIcon}>✓</Text>
        <Text style={styles.successText}>Card verified</Text>
      </View>
    );
  }

  if (status === 'invalid') {
    const reason = responseCode
      ? (REJECTION_REASONS[responseCode] ?? `Rejected (code ${responseCode})`)
      : 'Card validation failed';
    return (
      <View style={[styles.row, styles.errorBg]}>
        <Text style={styles.errorIcon}>✗</Text>
        <Text style={styles.errorText}>{reason}</Text>
      </View>
    );
  }

  if (status === 'offline') {
    return (
      <View style={[styles.row, styles.warningBg]}>
        <Text style={styles.warningIcon}>⚠</Text>
        <Text style={styles.warningText}>Validation offline</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  pendingBg: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  pendingText: {
    fontSize: 14,
    color: '#64748b',
  },
  successBg: {
    backgroundColor: '#dcfce7',
    borderColor: '#bbf7d0',
  },
  successIcon: {
    color: '#16a34a',
    fontWeight: '700',
  },
  successText: {
    fontSize: 14,
    color: '#15803d',
    fontWeight: '500',
  },
  errorBg: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
  },
  errorIcon: {
    color: '#dc2626',
    fontWeight: '700',
  },
  errorText: {
    fontSize: 14,
    color: '#b91c1c',
  },
  warningBg: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  warningIcon: {
    color: '#d97706',
    fontWeight: '700',
  },
  warningText: {
    fontSize: 14,
    color: '#b45309',
  },
});
