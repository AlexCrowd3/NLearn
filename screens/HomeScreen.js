import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';

const HomeScreen = () => {
  const navigation = useNavigation(); // ✅ Получаем объект навигации
  const [isOpen, setIsOpen] = useState(false);

  const scaleValue = useRef(new Animated.Value(1)).current;
  
  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: false,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const animatedStyle = { transform: [{ scale: scaleValue }] };

  return (
    <View style={styles.container}>
      <Header setIsOpen={setIsOpen} />
      <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} />

      <View style={styles.info}>
        <Text style={styles.text_info}>Ваш последний курс</Text>
        <View style={styles.info_block}>
          <Text style={styles.textPy}>Python разработка</Text>
          <Image 
            source={require('../assets/python_logo.png')}
            style={styles.pythonLogoMax}
          />
        </View>
        <View style={styles.progressBar}>
          <View style={styles.progressFill}>
            <Text style={styles.progress_text}>40%</Text>
          </View>
        </View>
      </View>

      {/* Кнопка Python разработка */}
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
          onPress={() => null}
        >
          <Text style={styles.buttonText}>Python разработка</Text>
          <Image
            source={require('../assets/python_logo.png')}
            style={styles.pythonLogo}
          />
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.description3}>Почему именно мы?</Text>

      <Text style={styles.description}>
        Наше{' '}
        <Text style={styles.description2}>приложение</Text> работает на основе{' '}
        <Text style={styles.description2}>нейросети</Text>, что позволяет задавать дополнительные вопросы по теме, и сразу же получать ответ. Вы{' '}
        <Text style={styles.description2}>получаете</Text> возможность{' '}
        <Text style={styles.description2}>персонализировать</Text> ваше обучение и сделать его более{' '}
        <Text style={styles.description2}>продуктивным</Text>.
      </Text>

      {/* Слой затемнения */}
      {isOpen && (
        <View style={styles.overlay}/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    overflow: 'hidden',
  },
  courseTitle: {
    fontFamily: 'Comfortaa-Bold',
    color: '#D7D7D7',
    fontSize: 24,
    marginLeft: 30,
    marginTop: 60,
  },
  description: {
    marginTop: 25,
    fontFamily: 'Comfortaa-Medium',
    color: '#D7D7D7',
    fontSize: 16,
    width: 'auto',
    marginLeft: 30,
    marginRight: 30,
  },
  description2: {
    fontFamily: 'Comfortaa-Medium',
    color: '#A238B1',
    fontSize: 16,
  },
  description3: {
    marginLeft: 30,
    marginTop: 40,
    fontFamily: 'Comfortaa-Medium',
    color: '#FFFFFF',
    fontSize: 20,
  },
  progressBar: {
    width: 'auto',
    height: 40,
    backgroundColor: '#303030',
    borderRadius: 10,
  },
  progressFill: {
    width: '40%',
    height: 40,
    backgroundColor: '#3C98E4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress_text: {
    width: 'auto',
    fontFamily: 'Comfortaa-Medium',
    color: '#FFFFFF',
    fontSize: 20,
  },
  info: {
    justifyContent: 'space-between',
    padding: 30,
    width: 'auto',
    marginLeft: 30,
    marginRight: 30,
    height: 270,
    backgroundColor: '#1C1C1C',
    borderRadius: 20,
  },
  text_info: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Comfortaa-Medium',
  },
  info_block: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 'auto',
  },
  pythonLogoMax: {
    width: 72,
    height: 72,
  },
  textPy: {
    color: '#3C98E4',
    fontSize: 32,
    fontFamily: 'Comfortaa-Medium',
  },
  button: {
    marginTop: 25,
    backgroundColor: '#3C98E4',
    width: 'auto',
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingLeft: 21,
    paddingRight: 13,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Comfortaa-Medium',
  },
  pythonLogo: {
    width: 42,
    height: 42,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#272727', // Затемнение (полупрозрачный чёрный)
    zIndex: 99, // Чтобы слой был поверх всего, но ниже меню
    opacity: 0.8,
  }
});

export default HomeScreen;