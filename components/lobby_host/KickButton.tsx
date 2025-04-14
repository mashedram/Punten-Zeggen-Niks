import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';

export const KickButton = () => {
    const [spelerVerwijderen, spelerVerwijderd] = useState(true);

    return (
        <View>
            <Button
            onPress={() => {
                spelerVerwijderd(false);
            }}
            disabled={!spelerVerwijderen}
            title={spelerVerwijderen ? 'kick' : 'kicked'}
/>
        </View>
    )
}