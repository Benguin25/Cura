import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIntakeStore } from '../../store/intakeStore';
import { StepIndicator } from '../../components/intake/StepIndicator';
import { HealthCardStep } from '../../components/intake/HealthCardStep';
import { DemographicsForm } from '../../components/intake/DemographicsForm';

export default function IntakePage() {
  const { currentStep, resetIntake } = useIntakeStore();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.brand}>FirstAid Intake</Text>
        {currentStep !== 'health-card' && (
          <TouchableOpacity onPress={resetIntake}>
            <Text style={styles.startOver}>Start over</Text>
          </TouchableOpacity>
        )}
      </View>

      <StepIndicator currentStep={currentStep} />

      <View style={styles.body}>
        {currentStep === 'health-card' && <HealthCardStep />}
        {currentStep === 'demographics' && <DemographicsForm />}
        {currentStep === 'symptoms' && (
          <View style={styles.placeholderWrap}>
            <Text style={styles.placeholderTitle}>Symptoms</Text>
            <Text style={styles.placeholderBody}>Step 3 — coming soon.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  brand: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D9E75',
  },
  startOver: {
    fontSize: 14,
    color: '#64748b',
  },
  body: {
    flex: 1,
  },
  placeholderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  placeholderBody: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});
