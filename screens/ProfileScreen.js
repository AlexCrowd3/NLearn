import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ onNavigate }) => {
  const [userData, setUserData] = useState(null);
  
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('userData');
        if (data) {
          setUserData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
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
      <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} currentRoute="Profile"/>
      
      <View style={styles.topPanel}>
        <View style={styles.avatarPhotoContainer}>
          <Image source={require('../assets/avatar_photo.png')} style={styles.avatarPhoto} />
        </View>
        <View style={styles.topPanelContainer}>
          <Text style={styles.fio}>{userData?.lastname ? `${userData.lastname}` : 'Error'}</Text>
          <Text style={styles.fio}>{userData?.name ? `${userData.name}` : ''}</Text>
          <Text style={styles.userInfo}>{userData?.telephone_number ? `${userData.telephone_number}` : ''}</Text>
          <Text style={styles.userInfo}>{userData?.email ? `${userData.email}` : ''}</Text>
        </View>
      </View>
      <View style={styles.cupContainer}>
        <Text style={styles.cupContainerText}>Золото</Text>
        <Image source={require('../assets/cup_gold_icon.png')} style={styles.cupContainerImage} />
      </View>
      <View style={styles.answerContainer}>
        <Text style={styles.answerContainerPersent}>100%</Text>
        <Text style={styles.answerContainerText}>Правильных ответов</Text>
      </View>
      <View style={styles.CountCoursesContainer}>
        <Text style={styles.CountCoursesContainerText}>Нет курсов</Text>
      </View>

      <Text style={styles.TitleCourses}>Мои курсы</Text>

      <View style={styles.CoursesContainer}>
        <Text  style={styles.CoursesContainerText}>У вас пока что нет активных курсов</Text>
      </View>

      <Animated.View style={[animatedStyle, styles.buttonCoursesWrapper]}>
        <TouchableOpacity
          style={styles.buttonCourses}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() => navigation.navigate('Courses')} 
          activeOpacity={1}
        >
          <Text style={styles.buttonCoursesText}>Выбрать курс</Text>
          <Image
            source={require('../assets/book_open_icon.png')}
            style={styles.buttonCoursesBookLogo}
          />
        </TouchableOpacity>
      </Animated.View>

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
  topPanel: {
    height: 'auto',
    width: 'auto',
    marginLeft: 30,
    marginRight: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarPhotoContainer: {
    width: '55%',
    height: 210,
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#A238B1',
    borderStyle: 'solid', 
    marginRight: 10,
  },
  avatarPhoto: {
    height: '100%',
    width: '100%',
    borderRadius: 14,
  },
  topPanelContainer: {
    flex: 1,
  },
  fio: {
    color: '#D946EF',
    fontSize: 18,
    fontFamily: 'Comfortaa-Medium',
    marginBottom: 5,
  },
  userInfo: {
    color: '#CDCDCD',
    fontSize: 16,
    fontFamily: 'Comfortaa-Medium',
    marginTop: 10,
  },
  cupContainer: {
    height: 50,
    backgroundColor: '#FABE2C',
    borderRadius: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '10%',
    paddingRight: '10%',
    marginLeft: 30, 
    marginRight: 30,
    marginBottom: 20,
  },
  cupContainerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Comfortaa-Bold',
  },
  cupContainerImage: {
    height: 35,
    width: 35,
  },
  answerContainer: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#2FD842',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '10%',
    paddingRight: '10%',
    marginLeft: 30, 
    marginRight: 30,
    marginBottom: 20,
  },
  answerContainerPersent: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Comfortaa-Bold',
  },
  answerContainerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Comfortaa-Bold',
    marginLeft: 10,
  },
  CountCoursesContainer: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#9B87F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30, 
    marginRight: 30,
    marginBottom: 20,
  },
  CountCoursesContainerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Comfortaa-Medium',
  },
  TitleCourses: {
    marginTop: 30,
    marginLeft: 30,
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Comfortaa-Bold',
  },
  CoursesContainer: {
    height: 'auto',
    width: 'auto',
    margin: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CoursesContainerText: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Comfortaa-Medium',
    width: '60%',
    textAlign: 'center',
  },
  buttonCourses: {
    height: 60,
    backgroundColor: '#A238B1',
    borderRadius: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 72,
    paddingLeft: 72,
  },
  buttonCoursesWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    zIndex: 98,
  },
  buttonCoursesText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Comfortaa-Bold',
  },
  buttonCoursesBookLogo: {
    height: 33,
    width: 33,
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

export default ProfileScreen;