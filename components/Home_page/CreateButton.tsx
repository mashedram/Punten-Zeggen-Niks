import React, {useState} from 'react'; 
import {Button, Text, View} from 'react-native';

export const CreateButton= () => {
    const [notPressed, pressed] = useState(true);

    return (
        <View>
            <Button
            title={'Create a game'}
        />
        </View>
    
    );

};