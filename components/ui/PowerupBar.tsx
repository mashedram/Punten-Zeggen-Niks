import { PowerUpList } from '@/constants/PowerUpList';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { PowerUpPopUp } from './PowerUpPopUp';
import React from 'react';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';

const PowerupCard = ({ id, onPress }: { id: string; onPress: () => void }) => {
  const [isMouseHovering, setMouseHovering] = useState(false);

  const card = PowerUpList.find(c => c.id === id);
  if (!card) {
    return <Text>Powerup not found</Text>;
  }

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, isMouseHovering && styles.cardHover]}>
      <Image
        style={styles.cardImage}
        source={card.image}
        width={20}
        height={20}
      />
    </Pressable>
  );
};

export const PowerupBar = () => {
  const stratego = useStrategoUnsafe();
  const [isOpen, setOpen] = useState(false);
  const [popupCard, setPopupCard] = useState<
    (typeof PowerUpList)[number] | null
  >(null);

  return (
    <>
      {popupCard && (
        <PowerUpPopUp
          name={popupCard.name}
          description={popupCard.description}
          image={popupCard.image}
          onDelete={() => setPopupCard(null)}
          onInzet={() => {
            console.log('Inzetten', popupCard.id);
            setPopupCard(null);
          }}
        />
      )}
      <View style={styles.container}>
        <View style={[styles.bar, isOpen ? {} : styles.barClosed]}>
          <Pressable onPress={() => setOpen(!isOpen)} style={styles.header}>
            <Text style={styles.headerText}>Powerups</Text>
          </Pressable>
          <View style={styles.cardBox}>
            <PowerupCard
              id="vergrootglas"
              onPress={() => setPopupCard(PowerUpList[0])}
            />
            <PowerupCard
              id="vergrootglas"
              onPress={() => setPopupCard(PowerUpList[0])}
            />
            <PowerupCard
              id="vergrootglas"
              onPress={() => setPopupCard(PowerUpList[0])}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',

    transform: [{ translateY: '0%' }],
  },

  bar: {
    backgroundColor: 'red',
    width: '100%',
    height: '30%',
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
