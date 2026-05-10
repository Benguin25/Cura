import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  COLORS,
  PRIORITY_TONE,
  type StepIndex,
  type TriageScore,
} from '../../types/onboarding';
import {
  PRIORITY_META,
  TIER_LABEL,
  type AnsweredQuestion,
} from '../../lib/triage';
import { CATEGORY_LABEL } from '../../data/questionBank';
import { useOnboarding } from './OnboardingContext';
import { StepLayout } from './components/StepLayout';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString();
}

interface SectionProps {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}

function Section({ title, onEdit, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onEdit ? (
          <Pressable
            onPress={onEdit}
            hitSlop={8}
            style={({ pressed }) => [styles.editBtn, pressed && styles.pressed]}
          >
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={3}>
        {value || '—'}
      </Text>
    </View>
  );
}

function PriorityBadge({ score }: { score: TriageScore }) {
  const meta = PRIORITY_META[score.priority];
  const tone = PRIORITY_TONE[score.priority];
  return (
    <View
      style={[styles.badge, { backgroundColor: tone.bg, borderColor: tone.border }]}
    >
      <Text style={[styles.badgeText, { color: tone.fg }]}>{meta.label}</Text>
    </View>
  );
}

function ScoreSummary({ score }: { score: TriageScore }) {
  const pct = Math.round(score.score * 100);
  const meta = PRIORITY_META[score.priority];
  return (
    <View>
      <PriorityBadge score={score} />
      <Text style={styles.recommendation}>{meta.recommendation}</Text>

      <View style={styles.scoreGrid}>
        <View style={styles.scoreCell}>
          <Text style={styles.scoreCellLabel}>Urgency score</Text>
          <Text style={styles.scoreCellValue}>{pct}%</Text>
        </View>
        <View style={styles.scoreCell}>
          <Text style={styles.scoreCellLabel}>Tier</Text>
          <Text style={styles.scoreCellValue}>
            {score.tier} · {TIER_LABEL[score.tier]}
          </Text>
        </View>
        <View style={styles.scoreCell}>
          <Text style={styles.scoreCellLabel}>Worst signal</Text>
          <Text style={styles.scoreCellValue}>{score.maxWeight}/10</Text>
        </View>
        <View style={styles.scoreCell}>
          <Text style={styles.scoreCellLabel}>Mean signal</Text>
          <Text style={styles.scoreCellValue}>
            {score.meanWeight.toFixed(1)}/10
          </Text>
        </View>
      </View>
    </View>
  );
}

function AnsweredList({ asked }: { asked: AnsweredQuestion[] }) {
  if (asked.length === 0) {
    return <Text style={styles.emptyText}>No questions answered yet.</Text>;
  }
  return (
    <View>
      {asked.map((a, idx) => {
        const maxOpt = a.selected.reduce<typeof a.selected[number] | null>(
          (best, cur) => (best && best.weight >= cur.weight ? best : cur),
          null,
        );
        return (
          <View key={`${a.questionId}-${idx}`} style={styles.qaRow}>
            <Text style={styles.qaQuestion}>
              {idx + 1}. {a.questionText}
            </Text>
            <Text style={styles.qaAnswer}>
              {a.selected.map((s) => s.label).join(' · ')}
            </Text>
            {maxOpt ? (
              <Text style={styles.qaWeight}>worst weight: {maxOpt.weight}/10</Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

export function Step4Review() {
  const { state, setStep, submitPatient } = useOnboarding();
  const { personal, measurements, triage, submitting, submitError } = state;

  const goEdit = (step: StepIndex) => () => setStep(step);

  const handleSubmit = () => {
    if (submitting) return;
    void submitPatient();
  };

  return (
    <StepLayout
      step={4}
      title="Review & submit"
      subtitle="Confirm everything looks right before checking in."
      onBack={() => setStep(3)}
      onContinue={handleSubmit}
      continueLabel={submitting ? 'Submitting…' : 'Submit'}
      continueDisabled={submitting}
    >
      <Section title="Triage assessment" onEdit={goEdit(3)}>
        {triage.score ? (
          <ScoreSummary score={triage.score} />
        ) : (
          <Text style={styles.emptyText}>
            Triage hasn't been completed yet. Go back to Step 3 to finish.
          </Text>
        )}
      </Section>

      <Section title="Symptom answers" onEdit={goEdit(3)}>
        <Text style={styles.metaLine}>
          Category: {triage.category ? CATEGORY_LABEL[triage.category] : '—'}
          {' · '}
          {triage.asked.length} of up to 10 questions
        </Text>
        <View style={styles.dividerSm} />
        <AnsweredList asked={triage.asked} />
      </Section>

      <Section title="Personal info" onEdit={goEdit(1)}>
        <Row label="Name" value={`${personal.firstName} ${personal.lastName}`.trim()} />
        <Row label="Date of birth" value={formatDate(personal.dateOfBirth)} />
        <Row label="Phone" value={personal.phone} />
        <Row label="Email" value={personal.email} />
      </Section>

      <Section title="Body measurements" onEdit={goEdit(2)}>
        <Row
          label="Weight"
          value={measurements.weightLbs ? `${measurements.weightLbs} lbs` : ''}
        />
        <Row
          label="Height"
          value={
            measurements.heightFeet || measurements.heightInches
              ? `${measurements.heightFeet || '0'}' ${measurements.heightInches || '0'}"`
              : ''
          }
        />
      </Section>

      {submitError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorTitle}>Couldn't submit</Text>
          <Text style={styles.errorBody}>{submitError}</Text>
        </View>
      ) : null}
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  editBtn: { paddingHorizontal: 4, paddingVertical: 4 },
  pressed: { opacity: 0.6 },
  editText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  sectionBody: { paddingHorizontal: 16, paddingBottom: 14 },
  row: { flexDirection: 'row', paddingVertical: 6, gap: 12 },
  rowLabel: { fontSize: 14, color: COLORS.textSecondary, width: 110 },
  rowValue: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  badgeText: { fontSize: 14, fontWeight: '700' },
  recommendation: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scoreCell: {
    flexBasis: '48%',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scoreCellLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  scoreCellValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  metaLine: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dividerSm: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  qaRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  qaQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  qaAnswer: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  qaWeight: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.error,
    marginBottom: 4,
  },
  errorBody: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
});
