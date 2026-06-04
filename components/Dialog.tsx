// MyDialog.jsx
import React, { ReactNode, useEffect, useRef } from 'react';
import { Pressable, Animated, KeyboardAvoidingView, Platform } from 'react-native';

export interface DialogProps {
  /** The content to be rendered inside the dialog. */
  children: ReactNode;
  /** A boolean to control the dialog's visibility. */
  isOpen: boolean;
  /** A function to call when the dialog should be closed. */
  onClose: () => void;
}

export const Dialog = ({ children, isOpen, onClose }: DialogProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;
  const [visible, setVisible] = React.useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true
        }),
        Animated.timing(scale, {
          toValue: 0.95,
          duration: 120,
          useNativeDriver: true
        })
      ]).start(() => setVisible(false));
    }
  }, [isOpen, opacity, scale]);

  if (!visible) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
      className='absolute w-full h-full z-50'
    >
      <Animated.View
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity
        }}
        className='w-full h-full justify-center items-center z-50'
      >
        <Pressable className='absolute h-full w-full' onPress={onClose} />
        <Animated.View
          style={{
            transform: [{ scale }]
          }}
          className='bg-background-50 dark:bg-background-800 rounded-xl p-5 w-auto'
        >
          <Pressable className='max-w-[90%] w-screen' onPress={(e) => e.stopPropagation()}>{children}</Pressable>
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};
