import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';

import images from '../assets/images';

const { height } = Dimensions.get('window');

const CourseDetailsScreen = ({ route }) => {
  const { course } = route.params; 
  const [expandedModules, setExpandedModules] = useState({});

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <View style={styles.container}>
      {/* Заголовок курса */}
      <View style={[styles.header, { backgroundColor: course.background }]}>
        <Text style={[styles.headerTitle, { color: course.textColor }]}>
          {course.title}
        </Text>
        <Image
          source={images[course.imageKey]}
          style={styles.logo}
        />
      </View>

      {/* Список модулей */}
      <ScrollView contentContainerStyle={styles.modulesContainer} style={{ maxHeight: height * 0.75, paddingBottom: 70, }}>
        {course.modules.map((module, index) => (
          <View key={module.title} style={styles.module}>
            <TouchableOpacity
              style={styles.moduleHeader}
              onPress={() => toggleModule(module.title)}
            >
              <View style={[styles.moduleNumberContainer, { backgroundColor: course.background }]}>
                <Text style={[styles.moduleNumber, {color: course.textColor}]}>{index + 1}</Text>
              </View>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Animated.Image
                source={require('../assets/arrow_down.png')}
                style={[
                  styles.arrowIcon,
                  {
                    transform: [
                      {
                        rotate: expandedModules[module.title]
                          ? '180deg'
                          : '0deg',
                      },
                    ],
                  },
                ]}
              />
            </TouchableOpacity>

            {/* Темы внутри модуля */}
            {expandedModules[module.title] && (
              <View style={styles.moduleContent}>
                {module.topics.map((topic, i) => (
                  <Text key={i} style={styles.topic}>
                    {`${i + 1}. ${topic}`}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Кнопка "Начать обучение" */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.startButton, { backgroundColor: course.background }]}>
          <Text style={[styles.startButtonText, { color: course.textColor }]}>Начать обучение</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerTitle: {
    width: '70%',
    fontSize: 36,
    fontFamily: 'Comfortaa-Medium',
  },
  logo: {
    width: 60,
    height: 60,
  },
  scrollContainer: {
    flex: 1,
  },
  modulesContainer: {
    marginHorizontal: 30,
    marginTop: 30,
  },
  module: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleNumberContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  moduleNumber: {
    fontSize: 24,
    fontFamily: 'Comfortaa-Medium',
  },
  moduleTitle: {
    flex: 1,
    fontSize: 18,
    color: '#FFFFFF',
  },
  arrowIcon: {
    width: 38,
    height: 38,
    tintColor: '#FFFFFF',
  },
  moduleContent: {
    marginTop: 20,
    paddingBottom: 20,
  },
  topic: {
    borderRadius: 10,
    fontSize: 16,
    fontFamily: 'Comfortaa-Medium',
    marginBottom: 20,
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#1C1C1C',
    color: '#CDCDCD',
  },
  footer: {
    zIndex: 99,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  startButton: {
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 15,
  },
  startButtonText: {
    fontSize: 24,
    fontFamily: 'Comfortaa-Medium',
    textAlign: 'center',
  },
});

export default CourseDetailsScreen;