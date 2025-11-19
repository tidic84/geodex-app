/**
 * Modern color palette for GeoDex app
 * Inspired by maps and geographic exploration
 */

const primary = '#2563EB'; // Vibrant blue
const primaryDark = '#60A5FA';
const success = '#10B981'; // Green
const warning = '#F59E0B'; // Amber
const error = '#EF4444'; // Red

export const Colors = {
  light: {
    primary,
    secondary: '#8B5CF6', // Purple
    success,
    warning,
    error,
    text: '#1F2937',
    textSecondary: '#6B7280',
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    surface: '#FFFFFF',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    tint: primary,
    icon: '#6B7280',
    iconActive: primary,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: primary,
    card: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.05)',
  },
  dark: {
    primary: primaryDark,
    secondary: '#A78BFA', // Light purple
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    background: '#111827',
    backgroundSecondary: '#1F2937',
    surface: '#1F2937',
    border: '#374151',
    borderLight: '#2D3748',
    tint: primaryDark,
    icon: '#9CA3AF',
    iconActive: primaryDark,
    tabIconDefault: '#6B7280',
    tabIconSelected: primaryDark,
    card: '#1F2937',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
  },
};
