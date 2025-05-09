import React, { useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';

export function AnimatedSwitch({ selected }: { selected: boolean }) {
  const translateX = useRef(new Animated.Value(selected ? 48 : 0)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: selected ? 48 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [selected, translateX]);

  return (
    <View
      style={[
        styles.switch,
        selected ? styles.switchSelected : styles.switchUnselected,
      ]}>
      <Animated.View
        style={[
          styles.switchHandle,
          {
            transform: [{ translateX }],
          },
        ]}>
        {selected && (
          <Svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <Path
              d="M4.36641 8.99994L0.566406 5.19994L1.51641 4.24994L4.36641 7.09994L10.4831 0.983276L11.4331 1.93328L4.36641 8.99994Z"
              fill="#090909"
            />
          </Svg>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  switch: {
    width: 90,
    height: 40,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent: 'center',
    backgroundColor: '#E6E0E9',
    paddingHorizontal: 4,
  },

  switchSelected: {
    backgroundColor: '#70C25C',
  },

  switchUnselected: {
    backgroundColor: '#E6E0E9',
  },
  switchHandle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});
