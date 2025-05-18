import { createStackNavigator } from '@react-navigation/stack'; // ← stack, не native-stack
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CoursesScreen from '../screens/CoursesScreen';
import MyTrainingScreen from '../screens/MyTrainingScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Courses" component={CoursesScreen} /> 
      <Stack.Screen name="MyTraining" component={MyTrainingScreen} /> 
    </Stack.Navigator>
  );
};

export default AppNavigator;