import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.headerWrap}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>+</Text>
          </View>
          <Text style={styles.title}>FirstAid</Text>
          <Text style={styles.subtitle}>Quick check-in for the emergency room</Text>
        </View>

        <View style={styles.actions}>
          <Text style={styles.eyebrow}>How would you like to check in?</Text>

          <Pressable
            onPress={() => navigation.navigate('CheckIn')}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.primaryBtnPressed,
            ]}
          >
            <Text style={styles.primaryBtnTitle}>Type in my information</Text>
            <Text style={styles.primaryBtnSubtitle}>Fill out a short intake form</Text>
          </Pressable>

          <Pressable onPress={() => {}} style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnTitle}>Scan my health card</Text>
            <Text style={styles.secondaryBtnSubtitle}>Coming soon</Text>
          </Pressable>
        </View>

        <Text style={styles.footnote}>
          If this is a life-threatening emergency, please notify staff immediately.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  headerWrap: {
    alignItems: 'center',
    marginTop: 48,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#1D9E75',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  primaryBtn: {
    backgroundColor: '#1D9E75',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  primaryBtnPressed: {
    backgroundColor: '#188660',
  },
  primaryBtnTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  primaryBtnSubtitle: {
    color: '#dcfce7',
    fontSize: 14,
    marginTop: 4,
  },
  secondaryBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  secondaryBtnTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryBtnSubtitle: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 4,
  },
  footnote: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
