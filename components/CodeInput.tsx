import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import {
  ButtonProps,
  StyleSheet,
  TextInput,
  TextInputProps,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

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
    <SafeAreaProvider>
      <SafeAreaView>
        <TextInput
          style={[{ color }, styles.input]}
          keyboardType="numeric"
          value={code}
          onChangeText={onChangeCode}
          {...rest}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default CodeInput;
