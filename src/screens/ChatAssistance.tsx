import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ChatAssistanceProps {
  onClose: () => void;
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatAssistance: React.FC<ChatAssistanceProps> = ({ onClose, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m here to help you on your quitting journey. How are you feeling today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickReplies = [
    'I\'m feeling stressed',
    'I have a strong craving',
    'I need motivation',
    'I want to celebrate my progress',
  ];

  const handleSendMessage = (text: string) => {
    if (text.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(text.trim()),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('stressed') || lowerMessage.includes('stress')) {
      return 'I understand stress can be challenging. Remember, smoking won\'t solve the problem. Try taking a few deep breaths or going for a short walk. What\'s causing you stress right now?';
    } else if (lowerMessage.includes('craving') || lowerMessage.includes('urge')) {
      return 'Cravings are temporary and will pass. Try the 4-4-4 breathing technique: inhale for 4 seconds, hold for 4, exhale for 4. You\'re stronger than this urge!';
    } else if (lowerMessage.includes('motivation') || lowerMessage.includes('motivated')) {
      return 'You\'re doing amazing! Every smoke-free moment is a victory. Think about why you started this journey. Your health, your family, your future self - they\'re all cheering you on!';
    } else if (lowerMessage.includes('celebrate') || lowerMessage.includes('progress')) {
      return 'That\'s fantastic! Celebrating your progress is so important. What milestone are you celebrating? Remember, every day smoke-free is a huge achievement!';
    } else {
      return 'Thank you for sharing that with me. I\'m here to support you through every step of your quitting journey. How can I help you today?';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        <Text style={styles.title}>Chat Assistant</Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#000000" />
        </Pressable>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.aiMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              message.isUser ? styles.userMessageText : styles.aiMessageText
            ]}>
              {message.text}
            </Text>
            <Text style={styles.timestamp}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Quick Replies */}
      {messages.length === 1 && (
        <View style={styles.quickRepliesContainer}>
          <Text style={styles.quickRepliesTitle}>Quick replies:</Text>
          <View style={styles.quickReplies}>
            {quickReplies.map((reply, index) => (
              <Pressable
                key={index}
                style={styles.quickReplyButton}
                onPress={() => handleSendMessage(reply)}
              >
                <Text style={styles.quickReplyText}>{reply}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          multiline
          maxLength={500}
        />
        <Pressable
          style={[
            styles.sendButton,
            inputText.trim() === '' && styles.sendButtonDisabled
          ]}
          onPress={() => handleSendMessage(inputText)}
          disabled={inputText.trim() === ''}
        >
          <Ionicons name="send" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    textAlign: 'right',
  },
  quickRepliesContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  quickRepliesTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  quickReplies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickReplyButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  quickReplyText: {
    fontSize: 14,
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
});

export default ChatAssistance; 