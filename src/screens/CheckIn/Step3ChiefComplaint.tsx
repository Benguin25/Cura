import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
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

  const canContinue =
    !!cc.description.trim() || cc.symptoms.length > 0;

  return (
    <StepLayout onContinue={next} continueDisabled={!canContinue}>
      <Text className="text-2xl font-bold text-slate-900 mt-2">
        Describe what you're feeling
      </Text>
      <Text className="text-sm text-slate-500 mt-1 mb-5">
        Use your own words. The more detail, the better.
      </Text>

      <TextInput
        multiline
        value={cc.description}
        onChangeText={(t) =>
          update('chiefComplaint', { ...cc, description: t })
        }
        placeholder="e.g. sharp pain in my lower back when I bend over, started after lifting a box this morning..."
        placeholderTextColor="#94a3b8"
        textAlignVertical="top"
        className="bg-white border border-slate-200 rounded-xl p-4 text-base text-slate-900 min-h-36"
      />

      <Text className="text-sm font-semibold text-slate-700 mt-6 mb-3">
        Or tap any that apply
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -20 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {SYMPTOM_CHIPS.map((s) => {
          const on = cc.symptoms.includes(s);
          return (
            <Pressable
              key={s}
              onPress={() => toggleSymptom(s)}
              className={`px-4 py-2.5 rounded-full border ${
                on
                  ? 'bg-[#1D9E75] border-[#1D9E75]'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text
                className={`text-sm ${
                  on ? 'text-white font-semibold' : 'text-slate-700'
                }`}
              >
                {s}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {cc.symptoms.length > 0 && (
        <Text className="text-xs text-slate-500 mt-3">
          {cc.symptoms.length} selected
        </Text>
      )}
    </StepLayout>
  );
}
