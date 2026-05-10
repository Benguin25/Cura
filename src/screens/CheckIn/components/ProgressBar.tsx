import { Text, View } from 'react-native';

type Props = { current: number; total: number };

export function ProgressBar({ current, total }: Props) {
  const pct = ((current + 1) / total) * 100;
  return (
    <View className="px-5 pt-2 pb-3">
      <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
        Step {current + 1} of {total}
      </Text>
      <View className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-[#1D9E75] rounded-full"
          style={{ width: `${pct}%` }}
        />
      </View>
    </View>
  );
}
