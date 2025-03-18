import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary',
  style,
  disabled = false,
  ...rest 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button, 
        styles[variant], 
        disabled && styles.disabled,
        style
      ]}
      disabled={disabled}
      {...rest}
    >
      <Text 
        style={[
          styles.text, 
          variant === 'outline' && styles.outlineText,
          disabled && styles.disabledText
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#3498db',
  },
  secondary: {
    backgroundColor: '#2ecc71',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  disabled: {
    backgroundColor: '#cccccc',
    borderColor: '#cccccc',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  outlineText: {
    color: '#3498db',
  },
  disabledText: {
    color: '#999999',
  },
}); 