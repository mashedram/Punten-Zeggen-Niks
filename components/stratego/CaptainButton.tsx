import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Animated, Easing, Text } from 'react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export const CaptainButton = ({
  onPress,
  count,
}: {
  onPress: () => void;
  count: number;
}) => {
  const bounceValue = new Animated.Value(1);

  useEffect(() => {
    const bounceAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1.2,
          duration: 600,
          easing: Easing.ease, // Use Easing.ease for a smooth animation
          useNativeDriver: false,
        }),
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 600,
          easing: Easing.ease, // Use Easing.ease for a smooth animation
          useNativeDriver: false,
        }),
      ]),
    );

    bounceAnim.start();

    return () => {
      bounceAnim.stop();
    };
  });

  return (
    <TouchableOpacity style={[styles.CaptainIconContainer]} onPress={onPress}>
      <Animated.View
        style={[
          count > 0
            ? { transform: [{ scale: bounceValue }] }
            : { transform: [{ scale: 1 }] },
        ]}>
        {count > 0 && (
          <View>
            <Svg
              style={styles.CaptainEllipse}
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none">
              <Circle cx={10} cy={10} r={10} fill="#FF2424" />
            </Svg>
            <Text style={styles.CaptainText}>{count}</Text>
          </View>
        )}
        <FontAwesome5 name="medal" size={40} style={styles.CaptainIcon} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  CaptainIconContainer: {
    position: 'absolute',
    top: 0,
    marginTop: 40,
  },
  CaptainEllipse: {
    position: 'absolute',
    borderRadius: 10,
  },
  CaptainIcon: {
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Inter',
    fontSize: 45,
    fontWeight: '700',
    zIndex: -1,
  },
  CaptainText: {
    position: 'absolute',
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    left: 5,
    top: 3,
  },
});
