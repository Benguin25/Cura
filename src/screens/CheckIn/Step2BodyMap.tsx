import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StepLayout } from './components/StepLayout';
import { BodySilhouette } from './components/BodySilhouette';
import { useCheckIn, BodyRegion, REGION_LABEL } from './CheckInContext';

export default function Step2BodyMap() {
  const [view, setView] = useState<'front' | 'back'>('front');
  const { data, update, next } = useCheckIn();

  const toggle = (r: BodyRegion) => {
    const has = data.bodyRegions.includes(r);
    update(
      'bodyRegions',
      has ? data.bodyRegions.filter((x) => x !== r) : [...data.bodyRegions, r]
    );
  };

  return (
    <StepLayout onContinue={next}>
      <Text style={styles.title}>Tap where you feel pain or discomfort</Text>
      <Text style={styles.subtitle}>
        Select all areas that apply. You can skip this step if no specific area is affected.
      </Text>

      <View style={styles.toggleWrap}>
        <Pressable
          onPress={() => setView('front')}
          style={[styles.tab, view === 'front' && styles.tabActive]}
        >
          <Text style={view === 'front' ? styles.tabTextActive : styles.tabText}>
            Front
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setView('back')}
          style={[styles.tab, view === 'back' && styles.tabActive]}
        >
          <Text style={view === 'back' ? styles.tabTextActive : styles.tabText}>
            Back
          </Text>
        </Pressable>
      </View>

      <View style={styles.bodyWrap}>
        <BodySilhouette
          view={view}
          selected={data.bodyRegions}
          onToggle={toggle}
        />
      </View>

      {data.bodyRegions.length > 0 && (
        <View style={styles.selectedWrap}>
          <Text style={styles.selectedLabel}>Selected</Text>
          <View style={styles.chipRow}>
            {data.bodyRegions.map((r) => (
              <View key={r} style={styles.chip}>
                <Text style={styles.chipText}>{REGION_LABEL[r]}</Text>
              </View>
            ))}
          </View>
        </View>
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
  },
  toggleWrap: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 9999,
    padding: 4,
    marginVertical: 20,
    alignSelf: 'center',
  },
  tab: {
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  tabActive: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    color: '#64748b',
  },
  tabTextActive: {
    color: '#0f172a',
    fontWeight: '600',
  },
  bodyWrap: {
    width: '100%',
    aspectRatio: 200 / 440,
    alignItems: 'center',
    alignSelf: 'center',
  },
  selectedWrap: {
    marginTop: 16,
  },
  selectedLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
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
});
