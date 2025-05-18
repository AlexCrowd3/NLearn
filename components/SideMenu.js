import React, { useState, useEffect } from 'react';
import { Animated, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SideMenu = ({ isOpen, setIsOpen}) => {
  const navigation = useNavigation(); 
  const slideAnimation = new Animated.Value(0); 

  useEffect(() => {
    if (isOpen) {
      Animated.spring(slideAnimation, {
        toValue: 1,
        tension: 20,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(slideAnimation, {
        toValue: 0,
        tension: 20,
        useNativeDriver: false,
      }).start();
    }
  }, [isOpen]);

  const slideInterpolate = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['100%', '0%'],
  });

  return (
    <Animated.View
      style={[
        styles.menu,
        { transform: [{ translateX: slideInterpolate }] },
      ]}
    >
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setIsOpen(false)}
      >
        <Image source={require('../assets/close_icon.png')} style={styles.closeIcon} />
      </TouchableOpacity>

      <View style={styles.navBlock}>
        {/* Элементы меню */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')} 
          style={styles.menuItem}
        >
          <Image source={require('../assets/home_icon.png')} style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Главная</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Profile')} 
          style={styles.menuItem}
        >
          <Image source={require('../assets/profile_icon.png')} style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Профиль</Text>
        </TouchableOpacity>
        <View style={styles.menuItem}>
          <Image source={require('../assets/kurs_icon.png')} style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Курсы</Text>
        </View>
        <View style={styles.menuItem}>
          <Image source={require('../assets/my_learn_icon.png')} style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Моё обучение</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '60%', // Ширина меню
    backgroundColor: '#1D1D1D', // Цвет меню
    padding: 20,
    zIndex: 100, // Чтобы меню было поверх всего
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 30,
  },
    closeIcon: {
    height: 44,
    width: 44,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  navBlock: {
    height: 200,
    width: 'auto',
    marginTop: 80,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuItemText: {
    textAlign: 'left',
    fontFamily: 'Comfortaa-Bold',
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 10,
  },
  menuItemIcon: {
    height: 24,
    width: 24,
  },
});

export default SideMenu;