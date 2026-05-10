import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../types/onboarding';
import { MEDICAL_HISTORY, type QuestionOption } from '../../data/questionBank';
import { type AnsweredQuestion, type SelectedOption } from '../../lib/triage';
import { useOnboarding } from './OnboardingContext';
import { StepLayout } from './components/StepLayout';

function toSelected(options: QuestionOption[]): SelectedOption[] {
  return options.map((o) => ({ id: o.id, label: o.label, weight: o.weight }));
}

export function Step3MedicalHistory() {
  const { updateMedicalHistory, setStep } = useOnboarding();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const [pendingMulti, setPendingMulti] = useState<QuestionOption[]>([]);

  const currentQ = MEDICAL_HISTORY[currentIdx];

  const onContinue = () => {
    const newAnswer: AnsweredQuestion = {
      questionId: currentQ.id,
      questionText: currentQ.text,
      selected: toSelected(pendingMulti),
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentIdx < MEDICAL_HISTORY.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setPendingMulti([]);
    } else {
      updateMedicalHistory(newAnswers);
      setStep(4);
    }
  };

  const onBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      // Pop last answer
      setAnswers(answers.slice(0, -1));
      setPendingMulti([]);
    } else {
      setStep(2);
    }
  };

  const toggleMulti = (opt: QuestionOption) => {
    setPendingMulti((cur) => {
      const has = cur.find((o) => o.id === opt.id);
      if (has) return cur.filter((o) => o.id !== opt.id);
      
      // If 'None' is picked, clear others. If others are picked, clear 'None'.
      if (opt.label.toLowerCase() === 'none') return [opt];
      return cur.filter(o => o.label.toLowerCase() !== 'none').concat(opt);
    });
  };

  return (
    <StepLayout
      step={3}
      title={currentQ.text}
      subtitle={`Question ${currentIdx + 1} of ${MEDICAL_HISTORY.length} · pick all that apply`}
      onBack={onBack}
      onContinue={onContinue}
      continueLabel={currentIdx === MEDICAL_HISTORY.length - 1 ? 'Finish' : 'Next'}
      continueDisabled={pendingMulti.length === 0}
    >
      <View style={styles.chipsRow}>
        {currentQ.options.map((opt) => {
          const selected = !!pendingMulti.find((o) => o.id === opt.id);
          return (
            <Pressable
              key={opt.id}
              onPress={() => toggleMulti(opt)}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: '45%',
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipPressed: {
    opacity: 0.7,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
