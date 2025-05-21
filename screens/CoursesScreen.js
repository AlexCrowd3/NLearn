import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import courses from '../data/courseData';
import images from '../assets/images';

const CoursesScreen = ({ onNavigate }) => {
  const navigation = useNavigation();
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
      <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} currentRoute="Courses" />

      <View style={styles.coursesContainer}>
        <Text style={styles.title}>Наши курсы</Text>

        {courses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={[
              styles.courseCard,
              { backgroundColor: course.background },
            ]}
            onPress={() =>
              navigation.navigate('CourseDetails', { course })
            }
            activeOpacity={1}
          >
            <Animated.View style={animatedStyle}>
              <View style={styles.cardContent}>
                <Text
                  style={[styles.courseTitle, { color: course.textColor }]}
                >
                  {course.title}
                </Text>
                <Image
                  source={images[course.imageKey]}
                  style={styles.courseLogo}
                />
              </View>
            </Animated.View>
          </TouchableOpacity>
        ))}
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
  courseLogo: {
    width: 42,
    height: 42,
  },
  courseTitle: {
    textAlign: 'left',
    fontSize: 20,
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
  },
});

export default CoursesScreen;