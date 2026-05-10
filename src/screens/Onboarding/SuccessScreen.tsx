import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../../types/onboarding';
import { useQueue } from '../../hooks/useQueue';
import { estimateWaitMinutes, formatWait } from '../../lib/estimateWait';
import { useOnboarding } from './OnboardingContext';

export function SuccessScreen() {
  const { state } = useOnboarding();
  const { data: queue } = useQueue();

  const patientCtas = state.triage.score?.tier ?? 5;
  const patientId = state.patientId;

  const waitMinutes = useMemo(() => {
    const idx = patientId
      ? queue.findIndex((q) => q.patient.id === patientId)
      : -1;

    const ahead =
      idx > 0
        ? queue
            .slice(0, idx)
            .filter((q) => q.triage.status === 'waiting')
            .map((q) => ({ ctasLevel: q.triage.ctas_level }))
        : queue
            .filter((q) => q.triage.status === 'waiting')
            .map((q) => ({ ctasLevel: q.triage.ctas_level }));

    const position = idx >= 0 ? idx : ahead.length;
    return estimateWaitMinutes(patientCtas, position, ahead);
  }, [queue, patientId, patientCtas]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.checkCircle}>
          <Svg width={56} height={56} viewBox="0 0 24 24">
            <Path
              d="M5 12.5l4.5 4.5L19 7"
              stroke="#ffffff"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </View>

        <Text style={styles.title}>You're checked in</Text>

        <View style={styles.waitBlock}>
          <Text style={styles.waitLabel}>Estimated wait</Text>
          <Text style={styles.waitValue}>{formatWait(waitMinutes)}</Text>
        </View>

        <Text style={styles.body}>
          Please take a seat — a nurse will call your name shortly.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  checkCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  waitBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  waitLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  waitValue: {
    fontSize: 44,
    fontWeight: '800',
    color: COLORS.primary,
    fontVariant: ['tabular-nums'],
  },
  body: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
