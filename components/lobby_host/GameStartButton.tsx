import React, {useState} from 'react'; 
import {Button, Text, View} from 'react-native';

export const GameStartButton= () => {
    const [notPressed, pressed] = useState(true);

    return (
        <View>
            <Button
            title={'Start'}
        />
        </View>
    
    );

};