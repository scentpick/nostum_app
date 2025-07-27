import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

// Common spacing values
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Common font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
} as const;

// Common colors (you can extend this with your theme colors)
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
} as const;

// Common flex styles
export const flex = {
  center: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  row: {
    flexDirection: 'row' as const,
  },
  column: {
    flexDirection: 'column' as const,
  },
  fill: {
    flex: 1,
  },
} as const;

// Common text styles
export const text = {
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold' as const,
  },
  subtitle: {
    fontSize: fontSize.md,
    opacity: 0.7,
  },
  body: {
    fontSize: fontSize.md,
  },
  caption: {
    fontSize: fontSize.sm,
    opacity: 0.6,
  },
} as const;

// Common container styles
export const container = {
  center: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: spacing.md,
  },
  padding: {
    padding: spacing.md,
  },
  margin: {
    margin: spacing.md,
  },
} as const;

// Style helper function
export const createStyles = <T extends Record<string, ViewStyle | TextStyle>>(styles: T) => {
  return StyleSheet.create(styles);
};

// Responsive helper (basic implementation)
export const responsive = {
  width: (percentage: number) => ({ width: `${percentage}%` }),
  height: (percentage: number) => ({ height: `${percentage}%` }),
} as const; 