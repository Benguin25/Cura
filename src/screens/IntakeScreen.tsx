import { useState } from 'react';
import {
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>First name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Last name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Phone number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Date of birth</Text>
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
            <Pressable
              style={styles.doneButton}
              onPress={() => setShowPicker(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          )}
        </View>
      )}

      <Text style={styles.label}>Weight</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        placeholder="lbs or kg"
      />

      <Text style={styles.label}>Height</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        placeholder="cm or ft/in"
      />

      <Text style={styles.label}>Symptoms</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={symptoms}
        onChangeText={setSymptoms}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        placeholder="Describe what you're feeling..."
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 48,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    minHeight: 42,
    justifyContent: 'center',
  },
  multiline: {
    minHeight: 100,
  },
  datePlaceholder: {
    color: '#888',
    fontSize: 16,
  },
  dateValue: {
    color: '#222',
    fontSize: 16,
  },
  doneButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  doneButtonText: {
    color: '#0a7d4f',
    fontWeight: '600',
  },
});
