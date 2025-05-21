import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CoursesScreen from '../screens/CoursesScreen';
import MyTrainingScreen from '../screens/MyTrainingScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import CourseDetailsScreen from '../screens/CourseDetailsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          setInitialRoute('Home');
        } else {
          setInitialRoute('Registration');
        }
      } catch (error) {
        console.error('Ошибка проверки данных:', error);
        setInitialRoute('Registration');
      }
    };
    checkUserData();
  }, []);

  if (initialRoute === null) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      {/* Регистрационный экран */}
      <Stack.Screen name="Registration" component={RegistrationScreen} />

      {/* Основные экраны */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Courses" component={CoursesScreen} />
      <Stack.Screen name="MyTraining" component={MyTrainingScreen} />
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;