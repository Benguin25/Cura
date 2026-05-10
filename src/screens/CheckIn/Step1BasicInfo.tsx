import { useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { StepLayout } from './components/StepLayout';
import { Dropdown } from './components/Dropdown';
import { useCheckIn } from './CheckInContext';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((m, i) => ({ label: m, value: String(i + 1) }));

const DAYS = Array.from({ length: 31 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}));

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 110 }, (_, i) => ({
  label: String(CURRENT_YEAR - i),
  value: String(CURRENT_YEAR - i),
}));

const inputClass =
  'bg-white border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900';
const inputErrorClass =
  'bg-white border border-red-400 rounded-xl px-4 py-3 text-base text-slate-900';

export default function Step1BasicInfo() {
  const { data, update, next } = useCheckIn();
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => {
    return {
      firstName: !data.firstName.trim() ? 'Required' : '',
      lastName: !data.lastName.trim() ? 'Required' : '',
      dob:
        !data.dob.day || !data.dob.month || !data.dob.year
          ? 'Please select your date of birth'
          : '',
      phone: !data.phone.trim() ? 'Required' : '',
      email: !/\S+@\S+\.\S+/.test(data.email) ? 'Enter a valid email' : '',
    };
  }, [data]);

  const hasErrors = Object.values(errors).some(Boolean);

  const handleContinue = () => {
    setSubmitted(true);
    if (!hasErrors) next();
  };

  const showErr = (k: keyof typeof errors) => submitted && errors[k];

  return (
    <StepLayout onContinue={handleContinue}>
      <Text className="text-2xl font-bold text-slate-900 mt-2">
        Let's get your basic info
      </Text>
      <Text className="text-sm text-slate-500 mt-1 mb-6">
        We'll use this to identify your record.
      </Text>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Text className="text-sm font-semibold text-slate-700 mb-1.5">
            First name
          </Text>
          <TextInput
            className={showErr('firstName') ? inputErrorClass : inputClass}
            value={data.firstName}
            onChangeText={(t) => update('firstName', t)}
            placeholder="Jane"
            placeholderTextColor="#94a3b8"
          />
          {showErr('firstName') ? (
            <Text className="text-xs text-red-500 mt-1">
              {errors.firstName}
            </Text>
          ) : null}
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-slate-700 mb-1.5">
            Last name
          </Text>
          <TextInput
            className={showErr('lastName') ? inputErrorClass : inputClass}
            value={data.lastName}
            onChangeText={(t) => update('lastName', t)}
            placeholder="Doe"
            placeholderTextColor="#94a3b8"
          />
          {showErr('lastName') ? (
            <Text className="text-xs text-red-500 mt-1">{errors.lastName}</Text>
          ) : null}
        </View>
      </View>

      <Text className="text-sm font-semibold text-slate-700 mt-4 mb-1.5">
        Date of birth
      </Text>
      <View className="flex-row gap-2">
        <View style={{ flex: 1 }}>
          <Dropdown
            value={data.dob.month}
            onChange={(v) => update('dob', { ...data.dob, month: v })}
            options={MONTHS}
            placeholder="Month"
            error={!!showErr('dob') && !data.dob.month}
          />
        </View>
        <View style={{ width: 80 }}>
          <Dropdown
            value={data.dob.day}
            onChange={(v) => update('dob', { ...data.dob, day: v })}
            options={DAYS}
            placeholder="Day"
            error={!!showErr('dob') && !data.dob.day}
          />
        </View>
        <View style={{ width: 90 }}>
          <Dropdown
            value={data.dob.year}
            onChange={(v) => update('dob', { ...data.dob, year: v })}
            options={YEARS}
            placeholder="Year"
            error={!!showErr('dob') && !data.dob.year}
          />
        </View>
      </View>
      {showErr('dob') ? (
        <Text className="text-xs text-red-500 mt-1">{errors.dob}</Text>
      ) : null}

      <Text className="text-sm font-semibold text-slate-700 mt-4 mb-1.5">
        Phone number
      </Text>
      <TextInput
        className={showErr('phone') ? inputErrorClass : inputClass}
        value={data.phone}
        onChangeText={(t) => update('phone', t)}
        keyboardType="phone-pad"
        placeholder="(555) 555-5555"
        placeholderTextColor="#94a3b8"
      />
      {showErr('phone') ? (
        <Text className="text-xs text-red-500 mt-1">{errors.phone}</Text>
      ) : null}

      <Text className="text-sm font-semibold text-slate-700 mt-4 mb-1.5">
        Email
      </Text>
      <TextInput
        className={showErr('email') ? inputErrorClass : inputClass}
        value={data.email}
        onChangeText={(t) => update('email', t)}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="jane@example.com"
        placeholderTextColor="#94a3b8"
      />
      {showErr('email') ? (
        <Text className="text-xs text-red-500 mt-1">{errors.email}</Text>
      ) : null}
    </StepLayout>
  );
}
