import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Modal, 
  TouchableWithoutFeedback,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
  Animated,
  Linking
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { User } from '@/services/authService';
import courseService from '../services/courseService';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  videos?: any[];
}

const BlinkingCursor = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ padding: 5 }}>
      <Animated.View style={[styles.cursorDot, { opacity }]} />
    </View>
  );
};

const TypeWriter = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  useEffect(() => {
    let currentText = '';
    let index = 0;
    
    setDisplayedText('');
    
    const timer = setInterval(() => {
      if (index < text.length) {
        currentText += text.charAt(index);
        setDisplayedText(currentText);
        index++;
      } else {
        clearInterval(timer);
        setShowCursor(false);
        if (onComplete) onComplete();
      }
    }, 20);

    return () => clearInterval(timer);
  }, []);

  return (
    <Text style={styles.aiText}>
      {displayedText}
      {showCursor && <Text style={{color: Colors.light.primary, fontWeight: 'bold'}}> |</Text>}
    </Text>
  );
};

const VideoItem = ({ title, link }: { title: string, link: string }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
      Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
      }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity onPress={() => Linking.openURL(link)} style={styles.videoItem}>
          <Ionicons name="play-circle-outline" size={20} color={Colors.light.tint} />
          <Text style={styles.videoLink} numberOfLines={1}>{title}</Text>
        </TouchableOpacity>
    </Animated.View>
  );
}

const SequentialVideoList = ({ videos }: { videos: any[] }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in the container
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();

    // Start showing items one by one
    const timer = setInterval(() => {
      setVisibleCount(prev => {
        if (prev < videos.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 800); // Delay between each video

    return () => clearInterval(timer);
  }, []);

  return (
    <Animated.View style={[styles.videoContainer, { opacity }]}>
      <Text style={styles.videoTitle}>Recommended Videos:</Text>
      {videos.slice(0, visibleCount).map((video: any, idx: number) => {
        const link = typeof video === 'string' ? video : (video.link || video.url || video.video_url);
        const title = typeof video === 'string' ? link : (video.title || video.name || link);
        if (!link) return null;
        
        return (
          <VideoItem key={idx} title={title} link={link} />
        );
      })}
    </Animated.View>
  );
};

const AIResponse = ({ text, videos }: { text: string, videos?: any[] }) => {
  const [isTextDone, setIsTextDone] = useState(false);

  return (
    <View>
      <TypeWriter text={text} onComplete={() => setIsTextDone(true)} />
      {isTextDone && videos && videos.length > 0 && (
         <SequentialVideoList videos={videos} />
      )}
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const jsonValue = await SecureStore.getItemAsync('userData');
      if (jsonValue) {
        setUser(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Failed to load user data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setModalVisible(false);
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userData');
    router.replace('/login');
  };

  const getUserImage = () => {
    return user?.image || 'https://via.placeholder.com/150';
  };

  const handleSearch = async () => {
    if (searchQuery.trim() && !isSearching) {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        text: searchQuery.trim(),
        sender: 'user'
      };
      
      setMessages(prev => [...prev, userMsg]);
      const currentQuery = searchQuery;
      setSearchQuery('');
      setIsSearching(true);

      try {
        const response = await courseService.searchCourse(currentQuery);
        console.log('Search response:', response);
        
        if (response && response.data) {
          let formattedText = response.data.summary || "Here is what I found:";
          
          if (response.data.learning_plan && Array.isArray(response.data.learning_plan) && response.data.learning_plan.length > 0) {
            formattedText += "\n\nLearning Plan:\n";
            response.data.learning_plan.forEach((step: string, index: number) => {
              formattedText += `${index + 1}. ${step}\n`;
            });
          }

          const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: formattedText,
            sender: 'ai',
            videos: response.data.videos
          };
          setMessages(prev => [...prev, aiMsg]);
        }
      } catch (error) {
        console.error('Search failed:', error);
        Alert.alert('Error', 'Failed to search for course.');
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: '',
        headerLeft: () => (
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color={Colors.light.text} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.profileButton}>
            {loading ? (
              <ActivityIndicator size="small" color={Colors.light.primary} />
            ) : (
              <Image 
                source={{ uri: getUserImage() }} 
                style={styles.profileImage} 
              />
            )}
          </TouchableOpacity>
        )
      }} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
        style={styles.flexContainer}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <View style={styles.welcomeContainer}>
              <Text style={styles.greeting}>Hello, {user?.displayName?.split(' ')[0] || 'there'}!</Text>
              <Text style={styles.subtitle}>What would you like to learn today?</Text>
            </View>
          ) : (
            <View style={styles.chatContainer}>
              {messages.map((msg) => (
                <View 
                  key={msg.id} 
                  style={[
                    styles.messageBubble, 
                    msg.sender === 'user' ? styles.userBubble : styles.aiBubble
                  ]}
                >
                  {msg.sender === 'user' ? (
                    <Text style={styles.userText}>{msg.text}</Text>
                  ) : (
                    <AIResponse text={msg.text} videos={msg.videos} />
                  )}
                </View>
              ))}
              {isSearching && (
                <View style={styles.aiBubble}>
                  <BlinkingCursor />
                </View>
              )}
            </View>
          )}
        </ScrollView>

        <View style={styles.inputWrapper}>
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for courses or ask anything..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              multiline={false}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              editable={true}
            />
            <TouchableOpacity 
              style={[styles.sendButton, (!searchQuery.trim() || isSearching) && styles.sendButtonDisabled]}
              onPress={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
            >
              <Ionicons name="arrow-up" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.footerText}>AI Course Finder can make mistakes. Check important info.</Text>
        </View>
      </KeyboardAvoidingView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.userInfo}>
                  <Image 
                    source={{ uri: getUserImage() }} 
                    style={styles.modalImage} 
                  />
                  <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
                  <Text style={styles.userEmail}>{user?.email || ''}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <TouchableOpacity onPress={handleLogout} style={styles.modalLogoutButton}>
                  <Ionicons name="log-out-outline" size={20} color={Colors.light.error} />
                  <Text style={styles.modalLogoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flexContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  chatContainer: {
    paddingHorizontal: 16,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 12,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#F0F0F0', // "Thin" light background
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  userText: {
    fontSize: 16,
    color: '#333',
  },
  aiText: {
    fontSize: 16,
    color: '#333',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  menuButton: {
    marginLeft: 15,
  },
  profileButton: {
    marginRight: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputWrapper: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 10 : 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: Colors.light.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
  footerText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  modalContent: {
    width: 250,
    backgroundColor: 'white',
    marginTop: 60,
    marginRight: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginBottom: 12,
  },
  modalLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFF0F0',
  },
  modalLogoutText: {
    marginLeft: 8,
    color: Colors.light.error,
    fontWeight: '600',
  },
  cursorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
  },
  cursor: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 8,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  videoLink: {
    marginLeft: 6,
    color: Colors.light.tint,
    fontSize: 14,
    textDecorationLine: 'underline',
    flex: 1,
  }
});