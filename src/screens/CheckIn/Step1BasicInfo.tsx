import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
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
      <Text style={styles.title}>Let&apos;s get your basic info</Text>
      <Text style={styles.subtitle}>We&apos;ll use this to identify your record.</Text>

      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={[styles.input, showErr('firstName') && styles.inputError]}
            value={data.firstName}
            onChangeText={(t) => update('firstName', t)}
            placeholder="Jane"
            placeholderTextColor="#94a3b8"
          />
          {showErr('firstName') ? (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          ) : null}
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={[styles.input, showErr('lastName') && styles.inputError]}
            value={data.lastName}
            onChangeText={(t) => update('lastName', t)}
            placeholder="Doe"
            placeholderTextColor="#94a3b8"
          />
          {showErr('lastName') ? (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          ) : null}
        </View>
      </View>

      <Text style={[styles.label, { marginTop: 16 }]}>Date of birth</Text>
      <View style={styles.dobRow}>
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
      {showErr('dob') ? <Text style={styles.errorText}>{errors.dob}</Text> : null}

      <Text style={[styles.label, { marginTop: 16 }]}>Phone number</Text>
      <TextInput
        style={[styles.input, showErr('phone') && styles.inputError]}
        value={data.phone}
        onChangeText={(t) => update('phone', t)}
        keyboardType="phone-pad"
        placeholder="(555) 555-5555"
        placeholderTextColor="#94a3b8"
      />
      {showErr('phone') ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

      <Text style={[styles.label, { marginTop: 16 }]}>Email</Text>
      <TextInput
        style={[styles.input, showErr('email') && styles.inputError]}
        value={data.email}
        onChangeText={(t) => update('email', t)}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="jane@example.com"
        placeholderTextColor="#94a3b8"
      />
      {showErr('email') ? <Text style={styles.errorText}>{errors.email}</Text> : null}
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
  },
  dobRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
