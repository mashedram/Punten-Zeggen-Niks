import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

export default function IPhone13minitemplate() {
  return (
    <View style={styles.LayoutContainer}>
      <View style={styles.PowerupBar} />
      <View style={styles.ProgressieBar} />
      <View style={styles.ProgressieTeamB} />
      <View style={styles.ProgressieTeamR} />
      <Text style={styles.LevensTeamB}>60</Text>
      <Text style={styles.LevensTeamR}>58</Text>
      <Text style={styles.powerups}>Power-ups</Text>
      <Text style={styles.PijlPowerBar}>{'<'}</Text>
      <View style={styles.BattlogButtonBack} />
      <View style={styles.BattlelogButton} />
      <Text style={styles.PijlBattlelog}>{'^'}</Text>
      <ImageBackground
        style={styles.bomvest}
        source={require('../assets/images/Bomvest.jpg')}>
        <View />
      </ImageBackground>
      <ImageBackground
        style={styles.spionp}
        source={require('../assets/images/SpionP.jpg')}>
        <View />
      </ImageBackground>
      <ImageBackground
        style={styles.vergrootglas}
        source={require('../assets/images/Vergrootglas.jpg')}>
        <View />
      </ImageBackground>
      <ImageBackground
        source={require('../assets/images/Spion.png')}
        style={styles.kaartcontainer}>
        <View />
      </ImageBackground>
      <View style={styles.TussenProgressie} />
      <Svg
        style={styles.ellipse4}
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none">
        <Circle cx={10} cy={10} r={10} fill="white" />
      </Svg>
      <Svg
        style={styles.ellipse5}
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none">
        <Circle cx={10} cy={10} r={10} fill="white" />
      </Svg>
      <Svg
        style={styles.ellipse6}
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none">
        <Circle cx={10} cy={10} r={10} fill="white" />
      </Svg>
      <Text style={styles.Uitroepteken1}>!</Text>
      <Text style={styles.Uitroepteken2}>!</Text>
      <Text style={styles.Uitroepteken3}>!</Text>
      <Text style={styles.CaptainIcon}>🎖</Text>
      <Svg
        style={styles.ellipse}
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none">
        <Circle cx={10} cy={10} r={10} fill="#FF2424" />
      </Svg>
      <Text style={styles.CaptainUitroepteken}>!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  LayoutContainer: {
    position: 'relative',
    flexShrink: 0,
    backgroundColor: 'rgba(92, 163, 194, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  PowerupBar: {
    position: 'absolute',
    flexShrink: 0,
    top: 504,
    width: 375,
    height: 336,
    backgroundColor: 'rgba(194, 123, 92, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    borderRadius: 36,
  },
  ProgressieBar: {
    position: 'absolute',
    flexShrink: 0,
    top: 27,
    left: 46,
    width: 280,
    height: 10,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  ProgressieTeamB: {
    position: 'absolute',
    flexShrink: 0,
    top: 27,
    left: 52,
    width: 114,
    height: 10,
    backgroundColor: 'rgba(36, 11, 255, 1)',
  },
  ProgressieTeamR: {
    position: 'absolute',
    flexShrink: 0,
    top: 27,
    left: 207,
    width: 108,
    height: 10,
    backgroundColor: 'rgba(199, 15, 15, 1)',
  },
  LevensTeamB: {
    position: 'absolute',
    flexShrink: 0,
    top: 26,
    left: 20,
    width: 21,
    height: 11,
    textAlign: 'left',
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '700',
  },
  LevensTeamR: {
    position: 'absolute',
    flexShrink: 0,
    top: 26,
    left: 331,
    width: 21,
    height: 11,
    textAlign: 'left',
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '700',
  },
  powerups: {
    position: 'absolute',
    flexShrink: 0,
    top: 538,
    left: 100,
    width: 192,
    height: 58,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 45,
    // textShadow is not supported in React Native, consider using shadow props or a library
  },
  PijlPowerBar: {
    position: 'absolute',
    flexShrink: 0,
    top: 511,
    left: 179,
    width: 16,
    height: 30,
    // transform: "rotateZ(-90.00deg)", // Not valid, use array
    transform: [{ rotateZ: '-90deg' }],
    textAlign: 'left',
    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter',
    fontSize: 25,
    fontWeight: '700',
  },
  BattlogButtonBack: {
    position: 'absolute',
    flexShrink: 0,
    top: 58,
    left: -58,
    width: 143,
    height: 28,
    transform: [
      { rotateZ: '-90deg' },
      { translateX: -232 },
      { translateY: 340 },
    ],
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    borderRadius: 15,
  },
  BattlelogButton: {
    position: 'absolute',
    flexShrink: 0,
    top: 50,
    left: -58,
    width: 143,
    height: 28,
    transform: [
      { rotateZ: '-90deg' },
      { translateX: -240 },
      { translateY: 340 },
    ],
    backgroundColor: 'rgba(194, 123, 92, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    borderRadius: 15,
  },
  PijlBattlelog: {
    position: 'absolute',
    flexShrink: 0,
    top: 50,
    left: 6,
    width: 17,
    height: 28,
    transform: [
      { rotateZ: '-90deg' },
      { translateX: -240 },
      { translateY: 338 },
    ],
    textAlign: 'left',
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 34,
    fontWeight: '700',
  },
  bomvest: {
    position: 'absolute',
    flexShrink: 0,
    top: 596,
    left: 4,
    width: 116,
    height: 191,
  },
  spionp: {
    position: 'absolute',
    flexShrink: 0,
    top: 596,
    left: 124,
    width: 122,
    height: 191,
  },
  vergrootglas: {
    position: 'absolute',
    flexShrink: 0,
    top: 596,
    left: 250,
    width: 119,
    height: 191,
  },

  ____myVar: {
    position: 'absolute',
    flexShrink: 0,
    width: 102,
    height: 58,
    textAlign: 'center',
    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 45,
  },
  spion: {
    position: 'absolute',
    flexShrink: 0,
    top: 251,
    left: 104,
    width: 102,
    height: 58,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Inter',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 45,
  },
  kaartcontainer: {
    position: 'absolute',
    flexShrink: 0,
    left: 50,
    top: 50,
    width: 247,
    height: 277,
    borderRadius: 12,
    transform: [{ translateX: 0 }, { translateY: 140 }],
  },
  TussenProgressie: {
    position: 'absolute',
    flexShrink: 0,
    top: 27,
    left: 166,
    width: 41,
    height: 10,
    backgroundColor: 'rgb(0, 0, 0)',
  },
  ellipse4: {
    position: 'absolute',
    flexShrink: 0,
    top: 596,
    left: 175,
    width: 20,
    height: 20,
    overflow: 'visible',
  },
  ellipse5: {
    position: 'absolute',
    flexShrink: 0,
    top: 596,
    left: 299,
    width: 20,
    height: 20,
    overflow: 'visible',
  },
  ellipse6: {
    position: 'absolute',
    flexShrink: 0,
    top: 596,
    left: 52,
    width: 20,
    height: 20,
    overflow: 'visible',
  },
  Uitroepteken1: {
    position: 'absolute',
    flexShrink: 0,
    top: 597,
    left: 56,
    width: 12,
    height: 19,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  Uitroepteken2: {
    position: 'absolute',
    flexShrink: 0,
    top: 597,
    left: 179,
    width: 12,
    height: 19,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  Uitroepteken3: {
    position: 'absolute',
    flexShrink: 0,
    top: 597,
    left: 303,
    width: 12,
    height: 19,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  CaptainIcon: {
    position: 'absolute',
    flexShrink: 0,
    top: 64,
    left: 154,
    width: 67,
    height: 66,
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Inter',
    fontSize: 60,
    fontWeight: '700',
  },
  ellipse: {
    position: 'absolute',
    flexShrink: 0,
    top: 47,
    left: 154,
    width: 20,
    height: 20,
    overflow: 'visible',
  },
  CaptainUitroepteken: {
    position: 'absolute',
    flexShrink: 0,
    top: 49,
    left: 162,
    width: 4,
    height: 15,
    textAlign: 'left',
    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '400',
  },
});
