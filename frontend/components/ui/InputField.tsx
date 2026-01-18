import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TextInputProps, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

interface InputFieldProps extends Omit<TextInputProps, 'style'> {
  iconName?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const InputField: React.FC<InputFieldProps> = ({ iconName, isPassword, style, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[
      styles.container, 
      isFocused && styles.focusedContainer,
      style
    ]}>
      {iconName && (
        <Ionicons 
          name={iconName} 
          size={20} 
          color={isFocused ? Colors.light.primary : '#666'} 
          style={styles.icon} 
        />
      )}
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={isPassword && !showPassword}
        {...props}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
           <Ionicons 
            name={showPassword ? "eye-off-outline" : "eye-outline"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14, // Slightly taller for modern feel
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  focusedContainer: {
    borderColor: Colors.light.primary,
    backgroundColor: '#FFF',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
