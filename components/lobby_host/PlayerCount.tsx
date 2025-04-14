import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';

export const PlayerCount = ({ aantal }: { aantal: number }) => {
    const [spelerAantal] = useState(0);
    
    return (
        <View>
            <>
                Aantal spelers: {aantal}/8
            </>
        </View>
    );
}
