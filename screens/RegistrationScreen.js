import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [telephone_number, setTelephonenumber] = useState('');
  const [email, setEmail] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    lastname: '',
    password: '',
    telephone_number: '',
    email: '',
  });

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Поле "Имя" не может быть пустым';
      isValid = false;
    }

    if (!lastname.trim()) {
      newErrors.lastname = 'Поле "Фамилия" не может быть пустым';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Поле "Пароль" не может быть пустым';
      isValid = false;
    }

    // Проверка email
    if (!email.trim()) {
      newErrors.email = 'Поле "Email" не может быть пустым';
      isValid = false;
    } else {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValidEmail) {
        newErrors.email = 'Введите корректный почтовый адрес';
        isValid = false;
      }
    }

    if (!telephone_number.trim()) {
      newErrors.telephone_number = 'Поле "Телефон" не может быть пустым';
      isValid = false;
    } else if (!/^\+?\d+$/.test(telephone_number)) {
      newErrors.telephone_number = 'Введите корректный номер телефона';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleContinue = async () => {
  if (!validateInputs()) return;
  try {
    await AsyncStorage.setItem('userData', JSON.stringify({ name, lastname, password, telephone_number, email, courses: [] }));
    navigation.navigate('Home');
  } catch (e) {
    console.log('Ошибка сохранения данных:', e);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добро пожаловать!</Text>

      {/* Имя */}
      <View>
        <TextInput
          placeholder="Ваше имя"
          value={name}
          onChangeText={setName}
          style={[
            styles.input,
            errors.name ? styles.errorInput : styles.inputFocus,
          ]}
          placeholderTextColor="#888"
        />
        {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}
      </View>

      {/* Фамилия */}
      <View>
        <TextInput
          placeholder="Ваша фамилия"
          value={lastname}
          onChangeText={setLastname}
          style={[
            styles.input,
            errors.lastname ? styles.errorInput : styles.inputFocus,
          ]}
          placeholderTextColor="#888"
        />
        {errors.lastname ? <Text style={styles.error}>{errors.lastname}</Text> : null}
      </View>

      {/* Телефон */}
      <View>
        <TextInput
          placeholder="Ваш номер телефона"
          value={telephone_number}
          onChangeText={setTelephonenumber}
          keyboardType="phone-pad"
          style={[
            styles.input,
            errors.telephone_number ? styles.errorInput : styles.inputFocus,
          ]}
          placeholderTextColor="#888"
        />
        {errors.telephone_number ? <Text style={styles.error}>{errors.telephone_number}</Text> : null}
      </View>

      {/* Email */}
      <View>
        <TextInput
          placeholder="Ваш Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={[
            styles.input,
            errors.email ? styles.errorInput : styles.inputFocus,
          ]}
          placeholderTextColor="#888"
        />
        {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}
      </View>

      {/* Пароль */}
      <View>
        <TextInput
          placeholder="Пароль..."
          value={password}
          onChangeText={setPassword}
          style={[
            styles.input,
            errors.password ? styles.errorInput : styles.inputFocus,
          ]}
          placeholderTextColor="#888"
        />
        {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Продолжить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Comfortaa-Bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#303030',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'Comfortaa-Medium',
  },
  inputFocus: {
    borderColor: '#A238B1',
  },
  errorInput: {
    borderColor: 'red',
    marginBottom: 2,
  },
  error: {
    color: 'red',
    marginTop: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#A238B1',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Comfortaa-Bold',
  },
});

export default RegistrationScreen;