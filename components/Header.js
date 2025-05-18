// components/Header.js
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import SideMenu from './SideMenu';

const Header = ({ setIsOpen }) => {
  return (
    <View style={styles.header}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <TouchableOpacity
        onPress={() => {setIsOpen(true)}}
        style={styles.menuIcon}
      >
        <Image source={require('../assets/Menu.png')} style={styles.menuIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    paddingTop: 15,
    backgroundColor: '#121212',
  },
  logo: {
    width: 100,
    height: 44,
    resizeMode: 'contain',
  },
  menuIcon: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
});

export default Header;