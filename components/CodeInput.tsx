import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const CodeInput = ({callback}:{callback: (code: string) => void }) => {
    const [number, setNumber] = React.useState('');

    const onChangeCode = (text: string) => {
        const cleanedValue = text.replace(/[^0-9]/g, '');
        if (cleanedValue.length > 6) {
            setNumber(cleanedValue.slice(0, 6));
            return;
        }
        setNumber(cleanedValue);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={number}
                    onChangeText={onChangeCode}
                />
                <button
                    onClick={() => callback(number)}
                >Join</button>
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