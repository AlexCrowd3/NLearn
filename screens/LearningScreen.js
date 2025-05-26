import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LearningScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { course, section: initialSection, question: initialQuestion } = route.params;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [currentSection, setSection] = useState(initialSection);
  const [currentQuestion, setQuestion] = useState(initialQuestion);
  const scrollViewRef = useRef(null);

  const formatText = (text) => {
    return text.split(/\*\*(.*?)\*\*/g).map((part, index) => {
      return index % 2 === 1 ? (
        <Text key={index} style={{ fontWeight: 'bold', color: '#A238B1' }}>
          {part}
        </Text>
      ) : (
        part
      );
    });
  };

  const queryAPI = async (prompt, retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(
          'https://api.cohere.ai/v1/generate',
          {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer test',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: prompt,
              parameters: {
                max_new_tokens: 300,
                return_full_text: false,
                temperature: 0.7,
              },
            }),
          }
        );

        const data = await response.json();

        if (response.status === 503) {
          const waitTime = (data.estimated_time + 2) * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        if (response.status === 429) {
          const backoffDelay = delay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          continue;
        }

        if (!response.ok || data.error) {
          throw new Error(data.error || `HTTP error ${response.status}`);
        }

        return data[0].generated_text.trim();
      } catch (error) {
        if (attempt === retries) throw error;
      }
    }
  };

  const sendToHuggingFace = async (prompt) => {
    setIsLoading(true);
    try {
      const generatedText = await queryAPI(prompt);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: generatedText || 'Не удалось получить ответ. Попробуйте переформулировать вопрос.' 
      }]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Система перегружена. Пожалуйста, повторите запрос через 10-15 секунд...' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInitialExplanation = () => {
    const topic = course.modules[currentSection].topics[currentQuestion];
    const prompt = `Сгенерируй структурированное объяснение по теме "${topic}". Формат:
    1. Краткое определение
    2. Основные характеристики
    3. Примеры использования
    4. Практическое применение
    Ответ должен быть максимам 300 токенов`;
    sendToHuggingFace(prompt);
  };

   const handleSendQuestion = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsInputVisible(false);

    const prompt = `Тема: ${course.modules[currentSection].topics[currentQuestion]}
    Вопрос: ${inputText}
    Ответь подробно с примерами:`;
    setMessages([]);
    sendToHuggingFace(prompt);
  };

  const handleAllUnderstood = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData') || '{"courses":[]}';
      const userData = JSON.parse(userDataString);
      
      const courseIndex = userData.courses.findIndex(c => c.title === course.title);
      const currentCourse = courseIndex !== -1 ? userData.courses[courseIndex] : null;

      let nextSection = currentSection;
      let nextQuestion = currentQuestion + 1;

      if (nextQuestion >= course.modules[nextSection].topics.length) {
        nextSection += 1;
        nextQuestion = 0;

        if (nextSection >= course.modules.length) {
          navigation.goBack();
          return;
        }
      }

      const updatedCourse = {
        ...course,
        section: nextSection,
        question: nextQuestion,
      };

      const newCourses = [...userData.courses];
      if (courseIndex !== -1) {
        newCourses[courseIndex] = updatedCourse;
      } else {
        newCourses.push(updatedCourse);
      }

      await AsyncStorage.setItem('userData', JSON.stringify({
        ...userData,
        courses: newCourses,
      }));

      setSection(nextSection);
      setQuestion(nextQuestion);
      setMessages([]);
      fetchInitialExplanation();

    } catch (e) {
      console.error('Progress Save Error:', e);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    fetchInitialExplanation();
  }, [currentSection, currentQuestion]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {`${currentSection + 1}.${currentQuestion + 1}. ${
            course.modules[currentSection].topics[currentQuestion]
          }`}
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.message,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage,
            ]}>
            <Image
              source={
                message.role === 'user'
                  ? require('../assets/user_icon.png')
                  : require('../assets/ai_icon.png')
              }
              style={styles.messageIcon}
            />
            <View style={styles.messageContent}>
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>
                  {formatText(message.content)}
                </Text>
              </View>
              {message.role === 'assistant' && (
                <TouchableOpacity
                  style={styles.askButton}
                  onPress={() => setIsInputVisible(true)}>
                  <Text style={styles.askButtonText}>Уточнить</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomContainer}>
        {isInputVisible ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ваш вопрос..."
              placeholderTextColor="#888"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendQuestion}
              multiline
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[styles.sendButton, isLoading && styles.disabledButton]}
              onPress={handleSendQuestion}
              disabled={isLoading}>
              <Text style={styles.sendButtonText}>➤</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.doneButton, isLoading && styles.disabledButton]}
            onPress={handleAllUnderstood}
            disabled={isLoading}>
            <Text style={styles.doneButtonText}>✓ Понятно</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#1C1C1C',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 1,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#A238B1',
  },
  title: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 40,
  },
  chatContainer: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    zIndex: -1,
    paddingVertical: 80,
    paddingHorizontal: 30
  },
  chatContent: {
    paddingBottom: 80,
    paddingHorizontal: 10,
  },
  message: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  messageIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  messageContent: {
    flex: 1,
    gap: 6,
  },
  messageBubble: {
    backgroundColor: '#272727',
    borderRadius: 12,
    padding: 12,
    maxWidth: '85%',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  userMessage: {
    flexDirection: 'row-reverse',
  },
  askButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  askButtonText: {
    fontSize: 14,
    color: '#A238B1',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: '#121212',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 45,
    maxHeight: 45,
    backgroundColor: '#272727',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#A238B1',
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  doneButton: {
    backgroundColor: '#2E2E2E',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A238B1',
  },
  doneButtonText: {
    color: '#A238B1',
    fontSize: 16,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default LearningScreen;