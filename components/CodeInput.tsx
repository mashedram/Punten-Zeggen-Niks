import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, TextProps } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export type CodeInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  onSubmit: (code: string) => void;
};

const CodeInput = ({
  lightColor,
  darkColor,
  onSubmit,
  ...rest
}: CodeInputProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const [number, setNumber] = React.useState('');

  const onChangeCode = (text: string) => {
    const cleanedValue = text.replace(/[^0-9]/g, '');
    if (cleanedValue.length > 6) {
      setNumber(cleanedValue.slice(0, 6));
      return;
    }
    setNumber(cleanedValue);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <TextInput
          style={[{ color }, styles.input]}
          keyboardType="numeric"
          value={number}
          onChangeText={onChangeCode}
          {...rest}
        />
        <button onClick={() => onSubmit(number)}>Join</button>
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
