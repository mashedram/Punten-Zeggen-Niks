import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { PowerUpPopUp } from './PowerUpPopUp';
import React from 'react';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';
import { PowerCards } from '@/constants/powercard/PowerCards';
import {
  PowerCardImages,
  PowerCardKeys,
} from '@/constants/powercard/PowerCardImages';
import { useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/api/query';

const PowerupCard = ({
  id,
  onPress,
}: {
  id: PowerCardKeys;
  onPress: () => void;
}) => {
  const card = PowerCards[id];
  if (!card) {
    return <Text>Powerup not found</Text>;
  }

  const image = PowerCardImages[id];

  return (
    <Pressable onPress={onPress} style={[styles.card]}>
      <Image style={styles.cardImage} source={image} width={20} height={20} />
    </Pressable>
  );
};

export const PowerupBar = () => {
  const stratego = useStrategoUnsafe();
  const [isOpen, setOpen] = useState(false);
  const [popupCardIndex, setPopupCardIndex] = useState<number | null>(null);

  const tRPC = useTRPC();
  const useCardMutation = useMutation(
    tRPC.stratego.usePowerCard.mutationOptions({}),
  );

  return (
    <>
      {popupCardIndex !== null && (
        <PowerUpPopUp
          index={popupCardIndex}
          cardId={stratego.self.powercards[popupCardIndex] as PowerCardKeys}
          inUse={popupCardIndex === stratego.self.activePowercardIndex}
          use={index => useCardMutation.mutateAsync({ index })}
          close={() => setPopupCardIndex(null)}
        />
      )}
      <View style={styles.container}>
        <View style={[styles.bar, isOpen ? {} : styles.barClosed]}>
          <Pressable onPress={() => setOpen(!isOpen)} style={styles.header}>
            <Text style={styles.headerText}>Powerups</Text>
          </Pressable>
          <View style={styles.cardBox}>
            {stratego.self.powercards.map((card, index) => (
              <PowerupCard
                key={index}
                id={card as PowerCardKeys}
                onPress={() => setPopupCardIndex(index)}
              />
            ))}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: '30%',
    display: 'flex',
    justifyContent: 'flex-end',
  },

  bar: {
    bottom: 0,
    backgroundColor: 'red',
    width: '100%',
    height: '100%',
    transitionDuration: '0.3s',
  },
  barClosed: {
    transform: [{ translateY: '80%' }],
  },
  header: {
    backgroundColor: 'white',
    height: '20%',
    padding: 10,
    borderRadius: 5,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    width: '100%',
  },
  cardBox: {
    width: '100%',
    height: '80%',

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '33%',
    height: '90%',

    transitionDuration: '0.2s',
  },
  cardHover: {
    transform: [{ scale: 1.05 }],
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
