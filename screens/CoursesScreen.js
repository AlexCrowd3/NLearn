import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import courses from '../data/courseData';
import images from '../assets/images';

const CoursesScreen = ({ onNavigate }) => {
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

  return (
    <View style={styles.container}>
      <Header setIsOpen={setIsOpen} />
      <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} currentRoute="Courses" />

      <View style={styles.coursesContainer}>
        <Text style={styles.title}>Наши курсы</Text>

        {courses.map((course) => {
          const isEnrolled = userCourses.some(
            (userCourse) => userCourse.title === course.title
          );

          return (
            <TouchableOpacity
              key={course.id}
              style={[
                styles.courseCard,
                { backgroundColor: course.background },
                isEnrolled && styles.grayCard,
              ]}
              onPress={() =>
                isEnrolled
                  ? null
                  : navigation.navigate('CourseDetails', { course })
              }
              activeOpacity={isEnrolled ? 1 : 0.6}
            >
              <Animated.View style={animatedStyle}>
                <View style={styles.cardContent}>
                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.courseTitle,
                        {
                          color: isEnrolled ? '#FFF' : course.textColor,
                        },
                      ]}
                    >
                      {course.title}
                    </Text>
                    {isEnrolled && (
                      <Text style={styles.enrolledText}>
                        Вы уже записаны
                      </Text>
                    )}
                  </View>

                  {!isEnrolled && (
                    <Image
                      source={images[course.imageKey]}
                      style={{
                        width: 42,
                        height: 42,
                      }}
                    />
                  )}
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  courseLogo: {
    width: 42,
    height: 42,
  },
  courseTitle: {
    textAlign: 'left',
    fontSize: 20,
    fontFamily: 'Comfortaa-Medium',
  },
  enrolledText: {
    fontSize: 14,
    fontFamily: 'Comfortaa-Medium',
    color: '#fff',
    marginTop: 5,
  },
  grayCard: {
    opacity: 0.6,
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
  },
});

export default CoursesScreen;