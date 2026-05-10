import React from 'react';
import { OnboardingProvider, useOnboarding } from './OnboardingContext';
import { StepHealthCard } from './StepHealthCard';
import { Step1PersonalInfo } from './Step1PersonalInfo';
import { Step2Measurements } from './Step2Measurements';
import { Step3MedicalHistory } from './Step3MedicalHistory';
import { Step2bBodyMap as StepBodyMap } from './StepBodyMap';
import { StepSymptoms } from './StepSymptoms';
import { Step4Review as StepReview } from './Step4Review';
import { SuccessScreen } from './SuccessScreen';

function OnboardingFlow() {
  const { state } = useOnboarding();

  if (state.submitted) return <SuccessScreen />;

  switch (state.step) {
    case 0:
      return <StepHealthCard />;
    case 1:
      return <Step1PersonalInfo />;
    case 2:
      return <Step2Measurements />;
    case 3:
      return <Step3MedicalHistory />;
    case 4:
      return <StepBodyMap />;
    case 5:
      return <StepSymptoms />;
    case 6:
      return <StepReview />;
    default:
      return <StepHealthCard />;
  }
}

export default function OnboardingScreen() {
  return (
    <OnboardingProvider>
      <OnboardingFlow />
    </OnboardingProvider>
  );
}
