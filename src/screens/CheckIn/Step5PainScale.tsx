import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StepLayout } from './components/StepLayout';
import { useCheckIn } from './CheckInContext';

const labelFor = (n: number | null) => {
  if (n == null) return '';
  if (n <= 3) return 'Mild discomfort';
  if (n <= 6) return 'Moderate pain';
  return 'Severe pain';
};

export default function Step5PainScale() {
  const { data, update, next } = useCheckIn();
  const canContinue = data.painLevel != null;

  return (
    <StepLayout onContinue={next} continueDisabled={!canContinue}>
      <Text style={styles.title}>Rate your pain</Text>
      <Text style={styles.subtitle}>1 = barely noticeable · 10 = worst pain imaginable</Text>

      <View style={styles.grid}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const sel = data.painLevel === n;
          return (
            <Pressable
              key={n}
              onPress={() => update('painLevel', n)}
              style={[styles.bubble, sel ? styles.bubbleActive : styles.bubbleInactive]}
            >
              <Text style={sel ? styles.bubbleTextActive : styles.bubbleTextInactive}>
                {n}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.labelWrap}>
        {data.painLevel != null && (
          <Text style={styles.severity}>{labelFor(data.painLevel)}</Text>
        )}
      </View>

      <Text style={styles.allergyTitle}>Do you have any allergies?</Text>
      <Text style={styles.allergyHelper}>
        Medications, foods, latex — anything we should know.
      </Text>
      <TextInput
        value={data.allergies}
        onChangeText={(t) => update('allergies', t)}
        placeholder="e.g. penicillin, peanuts (or 'none')"
        placeholderTextColor="#94a3b8"
        style={styles.input}
      />
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  grid: {
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  bubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bubbleActive: {
    backgroundColor: '#1D9E75',
    borderWidth: 0,
  },
  bubbleInactive: {
    backgroundColor: '#f8fafc',
  },
  bubbleTextActive: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  bubbleTextInactive: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  labelWrap: {
    alignItems: 'center',
    marginTop: 20,
    minHeight: 28,
  },
  severity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  allergyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 32,
    marginBottom: 8,
  },
  allergyHelper: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
  },
});
