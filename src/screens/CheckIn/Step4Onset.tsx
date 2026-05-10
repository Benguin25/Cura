import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StepLayout } from './components/StepLayout';
import {
  useCheckIn,
  ONSET_OPTIONS,
  PATTERN_OPTIONS,
  Onset,
  Pattern,
} from './CheckInContext';

type CardProps = {
  selected: boolean;
  label: string;
  onPress: () => void;
};

function Card({ selected, label, onPress }: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, selected ? styles.cardActive : styles.cardInactive]}
    >
      <Text style={selected ? styles.cardTextActive : styles.cardTextInactive}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function Step4Onset() {
  const { data, update, next } = useCheckIn();
  const canContinue = !!data.onset && !!data.pattern;

  return (
    <StepLayout onContinue={next} continueDisabled={!canContinue}>
      <Text style={styles.title}>Tell us about the timing</Text>
      <Text style={styles.subtitle}>Two quick questions about how this feels.</Text>

      <Text style={styles.sectionLabel}>When did this start?</Text>
      <View style={styles.cardGroup}>
        {ONSET_OPTIONS.map((o) => (
          <Card
            key={o.value}
            label={o.label}
            selected={data.onset === o.value}
            onPress={() => update('onset', o.value as Onset)}
          />
        ))}
      </View>

      <Text style={styles.sectionLabel}>How would you describe it?</Text>
      <View style={styles.cardGroup}>
        {PATTERN_OPTIONS.map((p) => (
          <Card
            key={p.value}
            label={p.label}
            selected={data.pattern === p.value}
            onPress={() => update('pattern', p.value as Pattern)}
          />
        ))}
      </View>
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
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 24,
    marginBottom: 12,
  },
  cardGroup: {
    gap: 8,
  },
  card: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardActive: {
    backgroundColor: '#dcfce7',
    borderColor: '#1D9E75',
  },
  cardInactive: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  cardTextActive: {
    fontSize: 16,
    color: '#1D9E75',
    fontWeight: '600',
  },
  cardTextInactive: {
    fontSize: 16,
    color: '#0f172a',
  },
});
