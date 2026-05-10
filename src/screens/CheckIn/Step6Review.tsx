import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { StepLayout } from './components/StepLayout';
import {
  useCheckIn,
  ONSET_OPTIONS,
  PATTERN_OPTIONS,
  REGION_LABEL,
} from './CheckInContext';

const formatDOB = (dob: { day: string; month: string; year: string }) => {
  if (!dob.day || !dob.month || !dob.year) return '—';
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][Number(dob.month) - 1];
  return `${month} ${dob.day}, ${dob.year}`;
};

const labelFor = (n: number | null) => {
  if (n == null) return '—';
  if (n <= 3) return 'Mild discomfort';
  if (n <= 6) return 'Moderate pain';
  return 'Severe pain';
};

type SectionProps = {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
};

function Section({ title, onEdit, children }: SectionProps) {
  return (
    <View className="bg-white border border-slate-200 rounded-2xl p-4 mb-3">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {title}
        </Text>
        <Pressable onPress={onEdit} hitSlop={8}>
          <Text className="text-sm text-[#1D9E75] font-semibold">Edit</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

function SuccessView() {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { reset } = useCheckIn();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
      <Animated.View
        style={{
          transform: [{ scale }],
          width: 96,
          height: 96,
          borderRadius: 48,
          backgroundColor: '#1D9E75',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 52, fontWeight: '800', lineHeight: 56 }}>
          ✓
        </Text>
      </Animated.View>
      <Animated.View style={{ opacity, alignItems: 'center' }}>
        <Text className="text-2xl font-bold text-slate-900">
          You're checked in
        </Text>
        <Text className="text-base text-slate-500 mt-2 text-center">
          A nurse will review your information shortly.
        </Text>
        <View className="mt-8 bg-slate-50 rounded-2xl p-5 w-full">
          <Text className="text-xs uppercase font-semibold text-slate-500 tracking-wide">
            Estimated wait time
          </Text>
          <Text className="text-3xl font-bold text-slate-900 mt-1">
            ~ 35 min
          </Text>
        </View>
        <Pressable
          onPress={() => {
            reset();
            navigation.popToTop();
          }}
          className="mt-8 px-6 py-3"
        >
          <Text className="text-[#1D9E75] font-semibold">Back to home</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

export default function Step6Review() {
  const { data, setStep } = useCheckIn();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return <SuccessView />;

  const handleSubmit = () => {
    console.log(
      'FirstAid check-in submitted:\n' + JSON.stringify(data, null, 2)
    );
    setSubmitted(true);
  };

  const onsetLabel =
    ONSET_OPTIONS.find((o) => o.value === data.onset)?.label ?? '—';
  const patternLabel =
    PATTERN_OPTIONS.find((p) => p.value === data.pattern)?.label ?? '—';

  return (
    <StepLayout onContinue={handleSubmit} continueLabel="Submit check-in">
      <Text className="text-2xl font-bold text-slate-900 mt-2 mb-1">
        Review and submit
      </Text>
      <Text className="text-sm text-slate-500 mb-5">
        Make sure everything looks right.
      </Text>

      <Section title="Patient" onEdit={() => setStep(0)}>
        <Text className="text-base text-slate-900 font-semibold">
          {data.firstName} {data.lastName}
        </Text>
        <Text className="text-sm text-slate-600 mt-1">
          DOB: {formatDOB(data.dob)}
        </Text>
        <Text className="text-sm text-slate-600">{data.phone}</Text>
        <Text className="text-sm text-slate-600">{data.email}</Text>
      </Section>

      <Section title="Pain locations" onEdit={() => setStep(1)}>
        {data.bodyRegions.length === 0 ? (
          <Text className="text-sm text-slate-400">None selected</Text>
        ) : (
          <View className="flex-row flex-wrap gap-2">
            {data.bodyRegions.map((r) => (
              <View
                key={r}
                className="bg-[#1D9E75]/10 border border-[#1D9E75] rounded-full px-3 py-1"
              >
                <Text className="text-[#1D9E75] text-sm font-medium">
                  {REGION_LABEL[r]}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Section>

      <Section title="What you're feeling" onEdit={() => setStep(2)}>
        {data.chiefComplaint.description ? (
          <Text className="text-sm text-slate-700 leading-5">
            {data.chiefComplaint.description}
          </Text>
        ) : (
          <Text className="text-sm text-slate-400">No description</Text>
        )}
        {data.chiefComplaint.symptoms.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-3">
            {data.chiefComplaint.symptoms.map((s) => (
              <View
                key={s}
                className="bg-slate-100 rounded-full px-3 py-1"
              >
                <Text className="text-slate-700 text-sm">{s}</Text>
              </View>
            ))}
          </View>
        )}
      </Section>

      <Section title="Onset & pattern" onEdit={() => setStep(3)}>
        <View className="flex-row justify-between">
          <Text className="text-sm text-slate-500">Started</Text>
          <Text className="text-sm text-slate-900 font-medium">
            {onsetLabel}
          </Text>
        </View>
        <View className="flex-row justify-between mt-1.5">
          <Text className="text-sm text-slate-500">Pattern</Text>
          <Text className="text-sm text-slate-900 font-medium">
            {patternLabel}
          </Text>
        </View>
      </Section>

      <Section title="Pain level" onEdit={() => setStep(4)}>
        <View className="flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-slate-900">
            {data.painLevel ?? '—'}
            <Text className="text-base font-normal text-slate-400"> / 10</Text>
          </Text>
          <Text className="text-sm text-slate-600">
            {labelFor(data.painLevel)}
          </Text>
        </View>
      </Section>

      <Section title="Allergies" onEdit={() => setStep(4)}>
        <Text className="text-sm text-slate-700">
          {data.allergies.trim() || 'None reported'}
        </Text>
      </Section>
    </StepLayout>
  );
}
