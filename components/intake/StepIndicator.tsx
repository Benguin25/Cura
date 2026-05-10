import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { IntakeStep } from '../../store/intakeStore';

const STEPS: { key: IntakeStep; label: string }[] = [
  { key: 'health-card', label: 'Health Card' },
  { key: 'demographics', label: 'Personal Info' },
  { key: 'symptoms', label: 'Symptoms' },
];

interface Props {
  currentStep: IntakeStep;
}

export function StepIndicator({ currentStep }: Props) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <View style={styles.container}>
      {STEPS.map((step, idx) => {
        const isCompleted = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        const active = isCompleted || isCurrent;

        return (
          <React.Fragment key={step.key}>
            <View style={styles.stepCol}>
              <View style={[styles.bubble, active ? styles.bubbleActive : styles.bubbleInactive]}>
                {isCompleted ? (
                  <Text style={styles.bubbleTextActive}>✓</Text>
                ) : (
                  <Text style={isCurrent ? styles.bubbleTextActive : styles.bubbleTextInactive}>
                    {idx + 1}
                  </Text>
                )}
              </View>
              <Text style={isCurrent ? styles.labelActive : styles.labelInactive}>
                {step.label}
              </Text>
            </View>
            {idx < STEPS.length - 1 && (
              <View style={[styles.connector, isCompleted ? styles.connectorActive : styles.connectorInactive]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  stepCol: {
    alignItems: 'center',
  },
  bubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleActive: {
    backgroundColor: '#1D9E75',
  },
  bubbleInactive: {
    backgroundColor: '#e2e8f0',
  },
  bubbleTextActive: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  bubbleTextInactive: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '700',
  },
  labelActive: {
    fontSize: 12,
    marginTop: 4,
    color: '#1D9E75',
    fontWeight: '500',
  },
  labelInactive: {
    fontSize: 12,
    marginTop: 4,
    color: '#64748b',
  },
  connector: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  connectorActive: {
    backgroundColor: '#1D9E75',
  },
  connectorInactive: {
    backgroundColor: '#e2e8f0',
  },
});
