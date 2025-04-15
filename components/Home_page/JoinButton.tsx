import React, {useState} from 'react'; 
import {Button, Text, View} from 'react-native';

export const JoinButton= () => {
    const [notPressed, pressed] = useState(true);

    return (
        <View>
            <Button
            title={'Join a game'}
        />
        </View>
    
    );

};