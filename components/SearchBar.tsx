import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Rechercher un lieu...',
  onFilterPress,
}: SearchBarProps) {
  const backgroundColor = useThemeColor({}, 'backgroundSecondary');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Ionicons name="search" size={20} color={iconColor} style={styles.searchIcon} />

      <TextInput
        style={[styles.input, { color: textColor }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={iconColor}
      />

      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <Ionicons name="close-circle" size={20} color={iconColor} />
        </Pressable>
      )}

      {onFilterPress && (
        <>
          <View style={[styles.divider, { backgroundColor: iconColor }]} />
          <Pressable onPress={onFilterPress} hitSlop={8}>
            <Ionicons name="options" size={20} color={primaryColor} />
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  divider: {
    width: 1,
    height: 20,
    opacity: 0.2,
  },
});
