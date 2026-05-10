import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { validateHealthCard } from '../../lib/hcv/client';
import { useIntakeStore } from '../../store/intakeStore';
import { HCVStatusBadge } from './HCVStatusBadge';

function formatHealthCard(digits: string): string {
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

export function HealthCardStep() {
  const { hcvStatus, hcvResponse, setHCVResult, setHealthCardInfo, setDemographics, advanceStep } =
    useIntakeStore();

  const [digits, setDigits] = useState('');
  const [versionCode, setVersionCode] = useState('');
  const [displayCard, setDisplayCard] = useState('');

  const isReadyToValidate = digits.length === 10;
  const isLoading = hcvStatus === 'pending';
  const canProceed = hcvStatus === 'valid' || hcvStatus === 'offline';

  function handleCardInput(text: string) {
    const d = text.replace(/\D/g, '').slice(0, 10);
    setDigits(d);
    setDisplayCard(formatHealthCard(d));
  }

  function handleVersionCode(text: string) {
    setVersionCode(text.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 2));
  }

  async function handleValidate() {
    setHCVResult('pending', null);
    const today = new Date().toISOString().split('T')[0];
    const response = await validateHealthCard({
      healthCardNumber: digits,
      versionCode: versionCode || '  ',
      serviceDate: today,
    });

    if (response.offline) {
      setHCVResult('offline', response);
    } else if (response.isValid) {
      setHCVResult('valid', response);
    } else {
      setHCVResult('invalid', response);
    }
  }

  function handleProceed() {
    setHealthCardInfo(digits, versionCode);

    if (hcvStatus === 'valid' && hcvResponse) {
      setDemographics({
        legalFirstName: hcvResponse.firstName ?? '',
        legalLastName: hcvResponse.lastName ?? '',
        dateOfBirth: hcvResponse.dateOfBirth ?? '',
        sexAtBirth:
          hcvResponse.gender === 'M'
            ? 'MALE'
            : hcvResponse.gender === 'F'
              ? 'FEMALE'
              : 'PREFER_NOT_TO_SAY',
      });
    }

    advanceStep();
  }

  const validateBtnActive = isReadyToValidate && !isLoading;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Health Card</Text>
      <Text style={styles.subtitle}>
        Enter your Ontario Health Card (OHIP) number to begin.
      </Text>

      {hcvStatus === 'offline' && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineTitle}>Validation unavailable</Text>
          <Text style={styles.offlineBody}>
            You may proceed with manual entry. Ensure details match your physical card.
          </Text>
        </View>
      )}

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Health Card Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={displayCard}
          onChangeText={handleCardInput}
          placeholder="#### ### ###"
          keyboardType="numeric"
          maxLength={12}
          editable={!isLoading}
          placeholderTextColor="#94a3b8"
        />
        <Text style={styles.helper}>10-digit number on your green OHIP card</Text>
      </View>

      <View style={styles.fieldGroupLg}>
        <Text style={styles.label}>
          Version Code{' '}
          <Text style={styles.helperInline}>(optional for older cards)</Text>
        </Text>
        <TextInput
          style={[styles.input, { width: 96 }]}
          value={versionCode}
          onChangeText={handleVersionCode}
          placeholder="AB"
          maxLength={2}
          autoCapitalize="characters"
          editable={!isLoading}
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.fieldGroupLg}>
        <HCVStatusBadge status={hcvStatus} responseCode={hcvResponse?.responseCode} />
      </View>

      <TouchableOpacity
        style={[styles.button, validateBtnActive ? styles.buttonPrimary : styles.buttonDisabled]}
        onPress={handleValidate}
        disabled={!isReadyToValidate || isLoading}
      >
        <Text style={validateBtnActive ? styles.buttonTextPrimary : styles.buttonTextDisabled}>
          {isLoading ? 'Validating…' : 'Validate Card'}
        </Text>
      </TouchableOpacity>

      {canProceed && (
        <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleProceed}>
          <Text style={styles.buttonTextPrimary}>Continue →</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
  },
  offlineBanner: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 12,
  },
  offlineTitle: {
    color: '#92400e',
    fontSize: 14,
    fontWeight: '500',
  },
  offlineBody: {
    color: '#b45309',
    fontSize: 14,
    marginTop: 4,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldGroupLg: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 6,
  },
  required: {
    color: '#dc2626',
  },
  helperInline: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '400',
  },
  helper: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: '#1D9E75',
  },
  buttonDisabled: {
    backgroundColor: '#e2e8f0',
  },
  buttonTextPrimary: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
  },
});
