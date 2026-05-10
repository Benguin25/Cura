import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

export default function IntakeScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const onDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selected) setDob(selected);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>
          This helps the triage nurse assess you faster.
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Field label="First name">
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Jane"
                  placeholderTextColor="#94a3b8"
                />
              </Field>
            </View>
            <View style={styles.col}>
              <Field label="Last name">
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Doe"
                  placeholderTextColor="#94a3b8"
                />
              </Field>
            </View>
          </View>

          <Field label="Email">
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="jane@example.com"
              placeholderTextColor="#94a3b8"
            />
          </Field>

          <Field label="Phone number">
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="(555) 555-5555"
              placeholderTextColor="#94a3b8"
            />
          </Field>

          <Field label="Date of birth">
            <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
              <Text style={dob ? styles.dateValue : styles.datePlaceholder}>
                {dob ? dob.toLocaleDateString() : 'Select date'}
              </Text>
            </Pressable>
            {showPicker && (
              <View>
                <DateTimePicker
                  value={dob ?? new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
                {Platform.OS === 'ios' && (
                  <Pressable onPress={() => setShowPicker(false)} style={styles.doneBtn}>
                    <Text style={styles.doneBtnText}>Done</Text>
                  </Pressable>
                )}
              </View>
            )}
          </Field>

          <View style={styles.row}>
            <View style={styles.col}>
              <Field label="Weight">
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholder="lbs or kg"
                  placeholderTextColor="#94a3b8"
                />
              </Field>
            </View>
            <View style={styles.col}>
              <Field label="Height">
                <TextInput
                  style={styles.input}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                  placeholder="cm or ft/in"
                  placeholderTextColor="#94a3b8"
                />
              </Field>
            </View>
          </View>

          <Field label="Symptoms">
            <TextInput
              style={[styles.input, styles.multiline]}
              value={symptoms}
              onChangeText={setSymptoms}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder="Describe what you're feeling..."
              placeholderTextColor="#94a3b8"
            />
          </Field>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  field: {
    marginBottom: 16,
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
    minHeight: 44,
    justifyContent: 'center',
  },
  multiline: {
    minHeight: 128,
  },
  dateValue: {
    color: '#0f172a',
    fontSize: 16,
  },
  datePlaceholder: {
    color: '#94a3b8',
    fontSize: 16,
  },
  doneBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  doneBtnText: {
    color: '#1D9E75',
    fontWeight: '600',
  },
});
