import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialButtonProps extends TouchableOpacityProps {
  title: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  // If we had a local image asset for Google, we'd use it. 
  // For now, we rely on Vector Icons or just text.
}

export const SocialButton: React.FC<SocialButtonProps> = ({ 
  title, 
  iconName, 
  style, 
  ...props 
}) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={[styles.container, style]} 
      {...props}
    >
      {iconName && (
        <Ionicons name={iconName} size={24} color="#000" style={styles.icon} />
      )}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
