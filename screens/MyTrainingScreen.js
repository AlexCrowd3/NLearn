import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';

const MyTrainingScreen = ({ onNavigate }) => {
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
        <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} currentRoute="MyTraining"/>
        <Text style={styles.Text}>Окно "Мое обучение"</Text>
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
  Text: {
    height: 100,
    width: '100%',
    marginTop: 300,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Comfortaa-Bold',
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