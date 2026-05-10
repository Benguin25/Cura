import { StyleSheet, Text, View } from 'react-native';

type Props = { current: number; total: number };

export function ProgressBar({ current, total }: Props) {
  const pct = ((current + 1) / total) * 100;
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        Step {current + 1} of {total}
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  track: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#1D9E75',
    borderRadius: 9999,
  },
});
