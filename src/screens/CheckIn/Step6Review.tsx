import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { StepLayout } from './components/StepLayout';
import {
  useCheckIn,
  ONSET_OPTIONS,
  PATTERN_OPTIONS,
  REGION_LABEL,
} from './CheckInContext';

const formatDOB = (dob: { day: string; month: string; year: string }) => {
  if (!dob.day || !dob.month || !dob.year) return '—';
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][Number(dob.month) - 1];
  return `${month} ${dob.day}, ${dob.year}`;
};

const labelFor = (n: number | null) => {
  if (n == null) return '—';
  if (n <= 3) return 'Mild discomfort';
  if (n <= 6) return 'Moderate pain';
  return 'Severe pain';
};

type SectionProps = {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
};

function Section({ title, onEdit, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable onPress={onEdit} hitSlop={8}>
          <Text style={styles.editLink}>Edit</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

function SuccessView() {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { reset } = useCheckIn();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  return (
    <SafeAreaView style={styles.successSafe}>
      <Animated.View style={[styles.successCircle, { transform: [{ scale }] }]}>
        <Text style={styles.successCheck}>✓</Text>
      </Animated.View>
      <Animated.View style={{ opacity, alignItems: 'center', width: '100%' }}>
        <Text style={styles.successTitle}>You&apos;re checked in</Text>
        <Text style={styles.successBody}>
          A nurse will review your information shortly.
        </Text>
        <View style={styles.waitCard}>
          <Text style={styles.waitLabel}>Estimated wait time</Text>
          <Text style={styles.waitValue}>~ 35 min</Text>
        </View>
        <Pressable
          onPress={() => {
            reset();
            navigation.popToTop();
          }}
          style={styles.backHomeBtn}
        >
          <Text style={styles.backHomeText}>Back to home</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

export default function Step6Review() {
  const { data, setStep } = useCheckIn();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return <SuccessView />;

  const handleSubmit = () => {
    console.log(
      'FirstAid check-in submitted:\n' + JSON.stringify(data, null, 2)
    );
    setSubmitted(true);
  };

  const onsetLabel =
    ONSET_OPTIONS.find((o) => o.value === data.onset)?.label ?? '—';
  const patternLabel =
    PATTERN_OPTIONS.find((p) => p.value === data.pattern)?.label ?? '—';

  return (
    <StepLayout onContinue={handleSubmit} continueLabel="Submit check-in">
      <Text style={styles.title}>Review and submit</Text>
      <Text style={styles.subtitle}>Make sure everything looks right.</Text>

      <Section title="Patient" onEdit={() => setStep(0)}>
        <Text style={styles.patientName}>
          {data.firstName} {data.lastName}
        </Text>
        <Text style={styles.detailFirst}>DOB: {formatDOB(data.dob)}</Text>
        <Text style={styles.detail}>{data.phone}</Text>
        <Text style={styles.detail}>{data.email}</Text>
      </Section>

      <Section title="Pain locations" onEdit={() => setStep(1)}>
        {data.bodyRegions.length === 0 ? (
          <Text style={styles.muted}>None selected</Text>
        ) : (
          <View style={styles.chipRow}>
            {data.bodyRegions.map((r) => (
              <View key={r} style={styles.chip}>
                <Text style={styles.chipText}>{REGION_LABEL[r]}</Text>
              </View>
            ))}
          </View>
        )}
      </Section>

      <Section title="What you're feeling" onEdit={() => setStep(2)}>
        {data.chiefComplaint.description ? (
          <Text style={styles.body}>{data.chiefComplaint.description}</Text>
        ) : (
          <Text style={styles.muted}>No description</Text>
        )}
        {data.chiefComplaint.symptoms.length > 0 && (
          <View style={[styles.chipRow, { marginTop: 12 }]}>
            {data.chiefComplaint.symptoms.map((s) => (
              <View key={s} style={styles.chipNeutral}>
                <Text style={styles.chipNeutralText}>{s}</Text>
              </View>
            ))}
          </View>
        )}
      </Section>

      <Section title="Onset & pattern" onEdit={() => setStep(3)}>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>Started</Text>
          <Text style={styles.kvValue}>{onsetLabel}</Text>
        </View>
        <View style={[styles.kvRow, { marginTop: 6 }]}>
          <Text style={styles.kvKey}>Pattern</Text>
          <Text style={styles.kvValue}>{patternLabel}</Text>
        </View>
      </Section>

      <Section title="Pain level" onEdit={() => setStep(4)}>
        <View style={styles.painRow}>
          <Text style={styles.painNumber}>
            {data.painLevel ?? '—'}
            <Text style={styles.painSlash}> / 10</Text>
          </Text>
          <Text style={styles.detail}>{labelFor(data.painLevel)}</Text>
        </View>
      </Section>

      <Section title="Allergies" onEdit={() => setStep(4)}>
        <Text style={styles.body}>{data.allergies.trim() || 'None reported'}</Text>
      </Section>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editLink: {
    fontSize: 14,
    color: '#1D9E75',
    fontWeight: '600',
  },
  patientName: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '600',
  },
  detailFirst: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  detail: {
    fontSize: 14,
    color: '#64748b',
  },
  body: {
    fontSize: 14,
    color: '#0f172a',
    lineHeight: 20,
  },
  muted: {
    fontSize: 14,
    color: '#94a3b8',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#1D9E75',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chipText: {
    color: '#1D9E75',
    fontSize: 14,
    fontWeight: '500',
  },
  chipNeutral: {
    backgroundColor: '#f8fafc',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chipNeutralText: {
    color: '#0f172a',
    fontSize: 14,
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kvKey: {
    fontSize: 14,
    color: '#64748b',
  },
  kvValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  painRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  painNumber: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0f172a',
  },
  painSlash: {
    fontSize: 16,
    fontWeight: '400',
    color: '#94a3b8',
  },
  successSafe: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1D9E75',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successCheck: {
    color: '#ffffff',
    fontSize: 52,
    fontWeight: '800',
    lineHeight: 56,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  successBody: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  waitCard: {
    marginTop: 32,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  waitLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  waitValue: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
  },
  backHomeBtn: {
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backHomeText: {
    color: '#1D9E75',
    fontWeight: '600',
  },
});
