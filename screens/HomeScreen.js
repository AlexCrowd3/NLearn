import React, { useRef, useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import courses from '../data/courseData';
import images from '../assets/images';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [lastCourse, setLastCourse] = useState(null);
  const [progress, setProgress] = useState('0%');
  const scaleValue = useRef(new Animated.Value(1)).current;
  

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // await AsyncStorage.clear();
        // console.log('Локальное хранилище очищено');

        const data = await AsyncStorage.getItem('userData');
        if (data) {
          const parsedData = JSON.parse(data);
          setUserData(parsedData);

          if (parsedData.courses && parsedData.courses.length > 0) {
            const lastCourseWithProgress = parsedData.courses.reduce((latest, course) => {
              return (!latest || course.progress > latest.progress) ? course : latest;
            }, null);

            if (lastCourseWithProgress) {
              const courseDetails = courses.find(c => c.title === lastCourseWithProgress.title);

              if (courseDetails) {
                setLastCourse(courseDetails);
                
                const progressValue = calculateCourseProgress(
                  courseDetails,
                  lastCourseWithProgress.section || 0,
                  lastCourseWithProgress.question || 0
                );
                
                setProgress(`${Math.round(progressValue * 100)}%`);
              }
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    loadUserData();
  }, []);

  // Функция для расчета прогресса курса (аналогичная из MyTrainingScreen)
  const calculateCourseProgress = (course, section, question) => {
    const totalTopics = course.modules.reduce(
      (total, module) => total + module.topics.length,
      0
    );
    
    if (totalTopics === 0) return 0; // Защита от деления на ноль
    
    let completedTopics = 0;
    
    // Пройденные модули
    for (let i = 0; i < section; i++) {
      completedTopics += course.modules[i].topics.length;
    }
    
    // Текущий модуль
    if (section < course.modules.length) {
      completedTopics += Math.min(question, course.modules[section].topics.length);
    }
    
    return completedTopics / totalTopics;
  };

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
      <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} currentRoute="Home"/>

      <View style={styles.info}>
        <Text style={styles.text_info}>Ваш последний курс</Text>

        {lastCourse ? (
          <>
            <View style={styles.info_block}>
              <Text style={[styles.textPy, { color: lastCourse.background }]}>
                {lastCourse.title}
              </Text>
              <Image
                source={images[lastCourse.imageKey]}
                style={styles.pythonLogoMax}
              />
            </View>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: progress,
                    backgroundColor: lastCourse.background,
                  },
                ]}
              >
                <Text style={styles.progress_text}>{progress}</Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={{ color: '#888', fontFamily: 'Comfortaa-Medium' }}>
            Нет активных курсов
          </Text>
        )}
      </View>
      <Text style={styles.Title1}>Самый популярный курс</Text>
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
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress_text: {
    fontFamily: 'Comfortaa-Medium',
    color: '#FFFFFF',
    fontSize: 16,
  },
  Title1: {
    width: 'auto',
    marginLeft: 30,
    marginTop: 60,
    fontFamily: 'Comfortaa-Bold',
    color: '#FFFFFF',
    fontSize: 24,
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
    fontSize: 32,
    fontFamily: 'Comfortaa-Medium',
    maxWidth: '70%',
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
    backgroundColor: '#272727',
    zIndex: 99,
    opacity: 0.8,
  }
});

export default HomeScreen;