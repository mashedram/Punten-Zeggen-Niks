import React, {useState} from 'react'; 
import {Button, Text, View} from 'react-native';

export const GameStartButton= () => {
const [nietIngeklikt, ingeklikt] = useState(true);

return (

    <View>
        <Button
        
        title={'Start'}
        />
    </View>

);

};