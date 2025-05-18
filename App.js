// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import loadFonts from './utils/loadFonts';

export default function App() {
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  useEffect(() => {
    const loadAppFonts = async () => {
      await loadFonts();
      setIsFontLoaded(true);
    };

    loadAppFonts();
  }, []);

  if (!isFontLoaded) {
    return null; 
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}