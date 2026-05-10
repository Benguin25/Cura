import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation';
import { useCheckIn, TOTAL_STEPS } from '../CheckInContext';
import { ProgressBar } from './ProgressBar';

type Props = {
  children: ReactNode;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  hideContinue?: boolean;
};

export function StepLayout({
  children,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled,
  hideContinue,
}: Props) {
  const { step, back } = useCheckIn();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleBack = () => {
    if (step === 0) navigation.goBack();
    else back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center px-2 pt-1">
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          className="w-10 h-10 items-center justify-center"
        >
          <Text className="text-3xl text-slate-700 leading-none">‹</Text>
        </Pressable>
      </View>
      <ProgressBar current={step} total={TOTAL_STEPS} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
        {!hideContinue && (
          <View className="px-5 pb-6 pt-3 border-t border-slate-100 bg-white">
            <Pressable
              onPress={onContinue}
              disabled={continueDisabled}
              className={`rounded-2xl py-4 items-center ${
                continueDisabled ? 'bg-slate-200' : 'bg-[#1D9E75]'
              }`}
            >
              <Text
                className={`text-base font-semibold ${
                  continueDisabled ? 'text-slate-400' : 'text-white'
                }`}
              >
                {continueLabel}
              </Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
