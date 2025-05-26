import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import courses from '../data/courseData';
import images from '../assets/images';
import { useNavigation } from '@react-navigation/native';

const MyTrainingScreen = ({ onNavigate }) => {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [userCourses, setUserCourses] = useState([]);
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Загрузка данных пользователя
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserCourses(userData.courses || []);
        }
      } catch (e) {
        console.log('Ошибка чтения данных:', e);
      }
    };

    loadUserData();
  }, []);

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

  // Функция для подсчёта общего количества пройденных вопросов
  const getTotalCompletedQuestions = (course, userSection, userQuestion) => {
    let total = 0;

    for (let i = 0; i < course.modules.length; i++) {
      const module = course.modules[i];
      const questionsInModule = module.topics.length;

      if (i < userSection) {
        // Глава полностью пройдена
        total += questionsInModule;
      } else if (i === userSection) {
        // Текущая глава частично пройдена
        total += userQuestion + 1; // Добавляем +1, так как question начинается с 0
      }
    }

    return total;
  };

  return (
    <View style={styles.container}>
      <Header setIsOpen={setIsOpen} />
      <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} currentRoute="MyTraining" />

      <View style={styles.coursesContainer}>
        <Text style={styles.title}>Мои курсы</Text>

        {userCourses.map((userCourse) => {
          const course = courses.find((c) => c.title === userCourse.title);

          if (!course) return null; // Если курс не найден, пропускаем

          // Рассчитываем общее количество пройденных вопросов
          const completedQuestions = getTotalCompletedQuestions(
            course,
            userCourse.section,
            userCourse.question
          );

          // Рассчитываем общий прогресс
          const totalQuestions = course.modules.reduce(
            (total, module) => total + module.topics.length,
            0
          );
          const progress = totalQuestions > 0
            ? (completedQuestions / totalQuestions) * 100
            : 0;

          return (
            <TouchableOpacity
              key={userCourse.title}
              style={[
                styles.courseCard,
                { backgroundColor: course.background },
              ]}
              onPress={() =>
                navigation.navigate('Learning', {
                  course,
                  section: userCourse.section,
                  question: userCourse.question,
                })
              }
              activeOpacity={0.6}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <Animated.View style={animatedStyle}>
                <View style={styles.cardContent}>
                  <Image
                    source={images[course.imageKey]}
                    style={styles.courseLogo}
                  />
                  <View style={styles.textContainer}>
                    <Text style={[styles.courseTitle, { color: course.textColor }]}>
                      {course.title}
                    </Text>
                    {/* Прогресс бар */}
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${progress}%` },
                        ]}
                      />
                    </View>
                    <Text style={[styles.progressText, {color: course.textColor}]}>
                      {`${Math.round(progress)}%`}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
      {isOpen && <View style={styles.overlay} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    overflow: 'hidden',
  },
  coursesContainer: {
    marginHorizontal: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Comfortaa-Medium',
    marginBottom: 30,
  },
  courseCard: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseLogo: {
    width: 42,
    height: 42,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 20,
    fontFamily: 'Comfortaa-Medium',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#A238B1',
    borderRadius: 4,
  },
  progressText: {
    marginTop: 2,
    fontSize: 14,
    fontFamily: 'Comfortaa-Medium',
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

export default MyTrainingScreen;