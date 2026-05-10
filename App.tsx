import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import IntakeScreen from './src/screens/IntakeScreen';
import type { RootStackParamList } from './src/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'FirstAid' }}
        />
        <Stack.Screen
          name="Intake"
          component={IntakeScreen}
          options={{ title: 'Patient Info' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
