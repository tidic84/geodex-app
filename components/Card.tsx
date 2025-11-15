import React from 'react';
import { View, StyleSheet, ViewProps, Pressable } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

type CardProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  onPress?: () => void;
  elevated?: boolean;
};

export function Card({
  style,
  lightColor,
  darkColor,
  onPress,
  elevated = true,
  ...otherProps
}: CardProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'card'
  );

  const content = (
    <View
      style={[
        styles.card,
        { backgroundColor },
        elevated && styles.elevated,
        style
      ]}
      {...otherProps}
    />
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          { opacity: pressed ? 0.7 : 1 }
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
