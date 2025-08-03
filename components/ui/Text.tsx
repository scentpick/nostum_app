import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { typography, fontWeights } from '../../lib/styles/typography';

export interface TextProps extends RNTextProps {
  variant?: keyof typeof typography;
  weight?: keyof typeof fontWeights;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ 
  variant = 'bodyMedium', 
  weight,
  style, 
  children, 
  ...props 
}) => {
  const textStyle = [
    typography[variant],
    weight && { fontFamily: fontWeights[weight] },
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

// 편의를 위한 특정 스타일 Text 컴포넌트들
export const Heading1: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h3" {...props} />
);

export const Heading4: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h4" {...props} />
);

export const Heading5: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h5" {...props} />
);

export const Heading6: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h6" {...props} />
);

export const BodyText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="bodyMedium" {...props} />
);

export const BodySmall: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="bodySmall" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption" {...props} />
);

export const ButtonText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="button" {...props} />
);

export const LinkText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="link" {...props} />
); 