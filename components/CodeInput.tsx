import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export type CodeInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  code: string;
  onChange: (code: string) => void;
};

const CodeInput = ({
  lightColor,
  darkColor,
  onChange,
  code,
  ...rest
}: CodeInputProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const onChangeCode = (text: string) => {
    const cleanedValue = text.replace(/[^0-9]/g, '');
    if (cleanedValue.length > 6) {
      onChange(cleanedValue.slice(0, 6));
      return;
    }
    onChange(cleanedValue);
  };

  return (
    <TextInput
      style={[{ color }, styles.input]}
      keyboardType="numeric"
      value={code}
      onChangeText={onChangeCode}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: '80%',
    margin: 0,
    borderWidth: 1,
  },
});

export default CodeInput;
