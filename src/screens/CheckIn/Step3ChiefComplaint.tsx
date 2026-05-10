import { Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { StepLayout } from './components/StepLayout';
import { useCheckIn } from './CheckInContext';

const SYMPTOM_CHIPS = [
  'Chest pain',
  'Shortness of breath',
  'Nausea',
  'Dizziness',
  'Fever',
  'Headache',
  'Vomiting',
  'Fatigue',
  'Numbness',
  'Palpitations',
];

export default function Step3ChiefComplaint() {
  const { data, update, next } = useCheckIn();
  const cc = data.chiefComplaint;

  const toggleSymptom = (s: string) => {
    const has = cc.symptoms.includes(s);
    update('chiefComplaint', {
      ...cc,
      symptoms: has ? cc.symptoms.filter((x) => x !== s) : [...cc.symptoms, s],
    });
  };

  const canContinue = !!cc.description.trim() || cc.symptoms.length > 0;

  return (
    <StepLayout onContinue={next} continueDisabled={!canContinue}>
      <Text style={styles.title}>Describe what you&apos;re feeling</Text>
      <Text style={styles.subtitle}>Use your own words. The more detail, the better.</Text>

      <TextInput
        multiline
        value={cc.description}
        onChangeText={(t) => update('chiefComplaint', { ...cc, description: t })}
        placeholder="e.g. sharp pain in my lower back when I bend over, started after lifting a box this morning..."
        placeholderTextColor="#94a3b8"
        textAlignVertical="top"
        style={styles.textarea}
      />

      <Text style={styles.sectionLabel}>Or tap any that apply</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollOverflow}
        contentContainerStyle={styles.chipScrollContent}
      >
        {SYMPTOM_CHIPS.map((s) => {
          const on = cc.symptoms.includes(s);
          return (
            <Pressable
              key={s}
              onPress={() => toggleSymptom(s)}
              style={[styles.chip, on ? styles.chipActive : styles.chipInactive]}
            >
              <Text style={on ? styles.chipTextActive : styles.chipTextInactive}>{s}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {cc.symptoms.length > 0 && (
        <Text style={styles.count}>{cc.symptoms.length} selected</Text>
      )}
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
    marginBottom: 20,
  },
  textarea: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#0f172a',
    minHeight: 144,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 24,
    marginBottom: 12,
  },
  scrollOverflow: {
    marginHorizontal: -20,
  },
  chipScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: '#1D9E75',
    borderColor: '#1D9E75',
  },
  chipInactive: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  chipTextActive: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  chipTextInactive: {
    fontSize: 14,
    color: '#0f172a',
  },
  count: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 12,
  },
});
