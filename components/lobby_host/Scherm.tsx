import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';
import { KickButton } from './KickButton';
import { SettingsButton } from './SettingsButton';
import { PlayerCount } from './PlayerCount';
import { GameStartButton } from './GameStartButton';
import { ReturnButton } from './ReturnButton';
import { SpelersLijst } from './SpelersLijst';
import { MenuButton } from './MenuButton';

export const Scherm = () => {
    

    return (
        <>
        <div>
        <KickButton/>
        <SettingsButton/>
        <PlayerCount aantal={0}/>
        <GameStartButton/>
        <ReturnButton/>
        <SpelersLijst/>
        <MenuButton/>
        </div>

</>
    
    
    )}