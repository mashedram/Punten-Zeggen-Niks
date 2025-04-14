import React, { useState } from 'react';
import { Button, Text, View, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';


export const SettingsButton = () => {
    const [nietIngeklikt, ingeklikt] = useState(true);

    const handlePress = () => {
        Alert.alert('Je hebt op de afbeelding gedrukt!');
        ingeklikt(!nietIngeklikt);
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        image: {
            width: 50,
            height: 50,
            borderRadius: 10,
        },
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress}>
                <Image
                    source={{ uri: 'https://i.pinimg.com/736x/9a/19/4e/9a194ee95fafa71205bd41d97ddb1c95.jpg' }}
                    style={styles.image}
                />
            </TouchableOpacity>
        </View>
    );
}
