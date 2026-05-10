import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerRow}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      </View>
      <ProgressBar current={step} total={TOTAL_STEPS} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
        {!hideContinue && (
          <View style={styles.footer}>
            <Pressable
              onPress={onContinue}
              disabled={continueDisabled}
              style={[
                styles.continueBtn,
                continueDisabled ? styles.continueBtnDisabled : styles.continueBtnActive,
              ]}
            >
              <Text
                style={
                  continueDisabled ? styles.continueTextDisabled : styles.continueTextActive
                }
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 30,
    color: '#0f172a',
    lineHeight: 30,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  continueBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueBtnActive: {
    backgroundColor: '#1D9E75',
  },
  continueBtnDisabled: {
    backgroundColor: '#e2e8f0',
  },
  continueTextActive: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  continueTextDisabled: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
  },
});
