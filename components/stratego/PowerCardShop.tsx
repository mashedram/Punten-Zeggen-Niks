import { PowerCardImages } from '@/constants/powercard/PowerCardImages';
import {
  PowerCardKeysType,
  PowerCards,
} from '@/constants/powercard/PowerCards';
import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PowerCardShopInspect } from './PowerCardShopInspect';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';
import React from 'react';

export const PowerCardShop = () => {
  const stratego = useStrategoUnsafe();
  const [focusedId, setFocusedId] = useState<PowerCardKeysType | null>(null);

  const teamCurrency = useMemo(() => {
    return (
      stratego.lobby.teams.find(team => team.id === stratego.self.teamId)
        ?.currency ?? 0
    );
  }, [stratego.lobby.teams, stratego.self.teamId]);

  return (
    <>
      {focusedId && (
        <PowerCardShopInspect
          cardId={focusedId}
          teamCurrency={teamCurrency}
          onClose={() => setFocusedId(null)}
        />
      )}
      <View style={styles.container}>
        <View style={styles.box}>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>{teamCurrency} points</Text>
          </View>
          <ScrollView
            style={styles.cardContainer}
            contentContainerStyle={styles.cardContainerInner}>
            {Object.entries(PowerCards).map(([key, card]) => {
              const image = PowerCardImages[key as PowerCardKeysType];

              return (
                <Pressable
                  style={styles.card}
                  key={key}
                  onPress={() => setFocusedId(key as PowerCardKeysType)}>
                  <Image style={styles.cardImage} source={image} />
                  <Text style={styles.cardName}>{card.name}</Text>
                  <Text>cost: {card.cost}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: '85%',
    height: '85%',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ccc',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsContainer: {
    width: '100%',
    height: '10%',
    backgroundColor: 'rgb(200, 200, 200)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  cardContainer: {
    width: '100%',
    height: '90%',
  },
  cardContainerInner: {
    width: '100%',
    height: '100%',

    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  card: {
    width: '30%',
    height: '32%',
    overflow: 'hidden',
    margin: '1%',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  cardImage: {
    width: '100%',
    resizeMode: 'contain',
    flex: 1,
    aspectRatio: 1,
  },
});
