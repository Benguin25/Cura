import { Pressable, Text, View } from 'react-native';
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
      className={`px-4 py-4 rounded-xl border ${
        selected
          ? 'bg-[#1D9E75]/10 border-[#1D9E75]'
          : 'bg-white border-slate-200'
      }`}
    >
      <Text
        className={`text-base ${
          selected ? 'text-[#1D9E75] font-semibold' : 'text-slate-900'
        }`}
      >
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
      <Text className="text-2xl font-bold text-slate-900 mt-2">
        Tell us about the timing
      </Text>
      <Text className="text-sm text-slate-500 mt-1">
        Two quick questions about how this feels.
      </Text>

      <Text className="text-base font-semibold text-slate-800 mt-6 mb-3">
        When did this start?
      </Text>
      <View className="gap-2">
        {ONSET_OPTIONS.map((o) => (
          <Card
            key={o.value}
            label={o.label}
            selected={data.onset === o.value}
            onPress={() => update('onset', o.value as Onset)}
          />
        ))}
      </View>

      <Text className="text-base font-semibold text-slate-800 mt-6 mb-3">
        How would you describe it?
      </Text>
      <View className="gap-2">
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
