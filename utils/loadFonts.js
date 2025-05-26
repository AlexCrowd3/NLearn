import * as Font from 'expo-font';

const loadFonts = async () => {
  await Font.loadAsync({
    // Comfortaa
    'Comfortaa-Regular': require('../assets/fonts/Comfortaa-Regular.ttf'),
    'Comfortaa-Bold': require('../assets/fonts/Comfortaa-Bold.ttf'),
    'Comfortaa-Light': require('../assets/fonts/Comfortaa-Light.ttf'),
    'Comfortaa-Medium': require('../assets/fonts/Comfortaa-Medium.ttf'),
    'Comfortaa-SemiBold': require('../assets/fonts/Comfortaa-SemiBold.ttf'),

    // Fira Code (для блоков кода)
    'FiraCode-Regular': require('../assets/fonts/FiraCode-Regular.ttf'),
    'FiraCode-Bold': require('../assets/fonts/FiraCode-Bold.ttf'),
  });
};

export default loadFonts;