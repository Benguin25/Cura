import { CheckInProvider, useCheckIn } from './CheckInContext';
import Step1BasicInfo from './Step1BasicInfo';
import Step2BodyMap from './Step2BodyMap';
import Step3ChiefComplaint from './Step3ChiefComplaint';
import Step4Onset from './Step4Onset';
import Step5PainScale from './Step5PainScale';
import Step6Review from './Step6Review';

function StepRouter() {
  const { step } = useCheckIn();
  switch (step) {
    case 0:
      return <Step1BasicInfo />;
    case 1:
      return <Step2BodyMap />;
    case 2:
      return <Step3ChiefComplaint />;
    case 3:
      return <Step4Onset />;
    case 4:
      return <Step5PainScale />;
    case 5:
      return <Step6Review />;
    default:
      return null;
  }
}

export default function CheckInScreen() {
  return (
    <CheckInProvider>
      <StepRouter />
    </CheckInProvider>
  );
}
