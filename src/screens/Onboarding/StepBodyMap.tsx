import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Image, Polygon, G } from 'react-native-svg';
import { COLORS } from '../../types/onboarding';
import { type CategoryCode } from '../../data/questionBank';
import { useOnboarding } from './OnboardingContext';
import { StepLayout } from './components/StepLayout';
import { IMG_W, IMG_H, BODY_PARTS, toPoints } from '../../data/bodyMap';

const BODY_PART_CATEGORY_MAP: Record<string, CategoryCode> = {
  '1': 'ENT',
  '2': 'NEUROLOGICAL',
  '3': 'NEUROLOGICAL',
  '4': 'CARDIOVASCULAR',
  '5': 'MUSCULOSKELETAL',
  '9': 'GASTROINTESTINAL',
  '10': 'GASTROINTESTINAL',
  '11': 'MUSCULOSKELETAL',
  '14': 'MUSCULOSKELETAL',
  '15': 'MUSCULOSKELETAL',
  '16': 'GASTROINTESTINAL',
  '17': 'MUSCULOSKELETAL',
  '18': 'MUSCULOSKELETAL',
  '19': 'NEUROLOGICAL',
  '20': 'MUSCULOSKELETAL',
  '21': 'MUSCULOSKELETAL',
  '22': 'MUSCULOSKELETAL',
  '23': 'MUSCULOSKELETAL',
  '24': 'MUSCULOSKELETAL',
  '25': 'MUSCULOSKELETAL',
  '26': 'MUSCULOSKELETAL',
  '27': 'MUSCULOSKELETAL',
  '28': 'MUSCULOSKELETAL',
  '29': 'MUSCULOSKELETAL',
  '30': 'MUSCULOSKELETAL',
  '31': 'MUSCULOSKELETAL',
  '32': 'MUSCULOSKELETAL',
  '33': 'MUSCULOSKELETAL',
  '34': 'MUSCULOSKELETAL',
  '35': 'MUSCULOSKELETAL',
  '36': 'MUSCULOSKELETAL',
  '37': 'MUSCULOSKELETAL',
  '38': 'MUSCULOSKELETAL',
  '39': 'MUSCULOSKELETAL',
  '40': 'MUSCULOSKELETAL',
  '41': 'MUSCULOSKELETAL',
  '42': 'MUSCULOSKELETAL',
};

// Maps body part keys → which chief complaint option IDs are relevant
const BODY_PART_TO_CHIEF_OPTIONS: Record<string, string[]> = {
  '2':  ['g'],           // Head → Neurological
  '1':  ['l'],           // Maxillofacial → ENT
  '3':  ['l', 'g'],      // Neck → ENT, Neurological
  '19': ['g'],           // Skull/Brain → Neurological
  '4':  ['a', 'b', 'c'], // Chest → Cardiovascular, Respiratory, Pain
  '20': ['m', 'd'],      // Right Shoulder → Musculoskeletal, Trauma
  '26': ['m', 'd'],      // Left Shoulder → Musculoskeletal, Trauma
  '32': ['m', 'd'],      // Right Humerus → Musculoskeletal, Trauma
  '40': ['m', 'd'],      // Left Humerus → Musculoskeletal, Trauma
  '22': ['m', 'd'],      // Right Elbow → Musculoskeletal, Trauma
  '29': ['m', 'd'],      // Left Elbow → Musculoskeletal, Trauma
  '23': ['m', 'd'],      // Right Forearm → Musculoskeletal, Trauma
  '28': ['m', 'd'],      // Left Forearm → Musculoskeletal, Trauma
  '24': ['m', 'd'],      // Right Wrist → Musculoskeletal, Trauma
  '31': ['m', 'd'],      // Left Wrist → Musculoskeletal, Trauma
  '25': ['m', 'd'],      // Right Hand → Musculoskeletal, Trauma
  '30': ['m', 'd'],      // Left Hand → Musculoskeletal, Trauma
  '10': ['f', 'c'],      // Abdominal → Gastrointestinal, Pain
  '9':  ['f', 'k'],      // Pelvis → Gastrointestinal, Reproductive
  '14': ['m', 'k'],      // Left Hip → Musculoskeletal, Reproductive
  '15': ['m'],           // Right Hip → Musculoskeletal
  '27': ['m', 'd'],      // Left Femur/Thigh → Musculoskeletal, Trauma
  '21': ['m', 'd'],      // Right Femur/Thigh → Musculoskeletal, Trauma
  '39': ['m', 'd'],      // Left Knee → Musculoskeletal, Trauma
  '33': ['m', 'd'],      // Right Knee → Musculoskeletal, Trauma
  '38': ['m', 'd'],      // Left Tib/Fib → Musculoskeletal, Trauma
  '34': ['m', 'd'],      // Right Tib/Fib → Musculoskeletal, Trauma
  '42': ['m', 'd'],      // Left Ankle → Musculoskeletal, Trauma
  '35': ['m', 'd'],      // Right Ankle → Musculoskeletal, Trauma
  '37': ['m', 'd'],      // Left Foot → Musculoskeletal, Trauma
  '36': ['m', 'd'],      // Right Foot → Musculoskeletal, Trauma
  '41': ['m', 'd', 'c'], // Spine → Musculoskeletal, Trauma, Pain
  '5':  ['m', 'd', 'c'], // Back → Musculoskeletal, Trauma, Pain
  '16': ['f', 'm'],      // Buttocks → Gastrointestinal, Musculoskeletal
  '17': ['m', 'd'],      // Right Shoulder (Back) → Musculoskeletal, Trauma
  '18': ['m', 'd'],      // Left Shoulder (Back) → Musculoskeletal, Trauma
  '11': ['m', 'd'],      // Right Arm (Back) → Musculoskeletal, Trauma
  '8':  ['m', 'd'],      // Left Arm (Back) → Musculoskeletal, Trauma
  '7':  ['m', 'd'],      // Right Leg (Back) → Musculoskeletal, Trauma
  '12': ['m', 'd'],      // Left Leg (Back) → Musculoskeletal, Trauma
};

function getFilteredChiefOptions(selection: string[]): string[] {
  // Collect all relevant option IDs across selected body parts
  const relevant = new Set<string>();
  for (const key of selection) {
    const optIds = BODY_PART_TO_CHIEF_OPTIONS[key] ?? [];
    optIds.forEach(id => relevant.add(id));
  }
  // Always include 'o' (Other / not sure) as escape hatch
  relevant.add('o');
  return Array.from(relevant);
}

function inferCategoryFromBodyMap(selection: string[]): CategoryCode | null {
  const counts: Record<CategoryCode, number> = {} as Record<CategoryCode, number>;
  for (const key of selection) {
    const category = BODY_PART_CATEGORY_MAP[key];
    if (category) {
      counts[category] = (counts[category] ?? 0) + 1;
    }
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? (top[0] as CategoryCode) : null;
}

export function Step2bBodyMap() {
  const { state, updateBodyMap, setTriageCategory, setStep } = useOnboarding();
  const { width: screenWidth } = useWindowDimensions();

  // Scale SVG to fill available width
  const svgWidth = screenWidth - 32; // 16px padding each side
  const scale = svgWidth / IMG_W;
  const svgHeight = IMG_H * scale;

  const [selections, setSelections] = useState<Set<string>>(
    new Set(state.bodyMap ?? []),
  );

  const toggle = (key: string) => {
    setSelections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      updateBodyMap(Array.from(next));
      return next;
    });
  };

  const handleContinue = () => {
    const arr = Array.from(selections);
    updateBodyMap(arr);

    // Infer the primary category from selected body parts
    const category = inferCategoryFromBodyMap(arr);
    if (category) {
      setTriageCategory(category);
    }

    // Move to symptom questions (step 5)
    setStep(5);
  };

  const selectedLabels = BODY_PARTS
    .filter((p) => selections.has(p.key))
    .map((p) => p.label);

  return (
    <StepLayout
      step={4}
      title="Where does it hurt?"
      subtitle="Tap all the areas that are bothering you."
      onBack={() => setStep(3)}
      onContinue={handleContinue}
      continueDisabled={false}
      continueLabel={
        selections.size > 0
          ? `Continue (${selections.size} selected)`
          : 'Continue — nothing selected'
      }
    >
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SVG body map: image + polygon overlays */}
        <Svg width={svgWidth} height={svgHeight}>
          <Image
            href={require('../../../assets/bodymap/img/males-1859518_960_720.jpg')}
            x={0}
            y={0}
            width={svgWidth}
            height={svgHeight}
            preserveAspectRatio="xMidYMid meet"
          />
          <G>
            {BODY_PARTS.map((part) => {
              const selected = selections.has(part.key);
              return (
                <Polygon
                  key={part.key}
                  points={toPoints(part.coords, scale)}
                  fill={selected ? COLORS.primary : '#00AAFF'}
                  fillOpacity={selected ? 0.45 : 0}
                  stroke={COLORS.primary}
                  strokeOpacity={selected ? 1 : 0}
                  strokeWidth={2 * scale}
                  onPress={() => toggle(part.key)}
                />
              );
            })}
          </G>
        </Svg>

        {/* Live selection chips */}
        {selectedLabels.length > 0 && (
          <View style={styles.chipsSection}>
            <Text style={styles.chipsLabel}>Selected areas:</Text>
            <View style={styles.chipsRow}>
              {selectedLabels.map((label) => (
                <View key={label} style={styles.chip}>
                  <Text style={styles.chipText}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 16,
    gap: 16,
  },
  chipsSection: {
    width: '100%',
    gap: 8,
  },
  chipsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
});
