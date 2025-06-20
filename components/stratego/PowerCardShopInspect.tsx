import { useTRPC } from '@/api/query';
import { PowerCardKeys } from '@/constants/powercard/PowerCardImages';
import { PowerCards } from '@/constants/powercard/PowerCards';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';
import { Picker } from '@react-native-picker/picker';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const PowerCardShopInspect = ({
  cardId,
  teamCurrency,
  onClose,
}: {
  cardId: PowerCardKeys;
  teamCurrency: number;
  onClose: () => void;
}) => {
  const card = PowerCards[cardId];

  const stratego = useStrategoUnsafe();
  const [target, setTarget] = useState<string | null>(null);

  const assignablePlayers = useMemo(() => {
    return stratego.players.filter(
      player =>
        player.id !== stratego.self.id &&
        player.powercards.length < 3 &&
        player.teamId === stratego.self.teamId,
    );
  }, [stratego.players, stratego.self.id, stratego.self.teamId]);

  const hasAssignablePlayers = assignablePlayers.length > 0;
  const hasEnoughCurrency = teamCurrency >= card.cost;
  const buyButtonDisabled =
    !hasAssignablePlayers || !hasEnoughCurrency || !target;

  const tRPC = useTRPC();
  const buyCardMutation = useMutation(
    tRPC.stratego.buyCardMutation.mutationOptions({}),
  );

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.cardName}>{card.name}</Text>
        <Text style={styles.cardDescription}>{card.description}</Text>
        <Text
          style={[styles.cardCost, hasEnoughCurrency ? {} : { color: 'red' }]}>
          Cost: {card.cost} points
        </Text>
        <Picker
          selectedValue={target}
          onValueChange={setTarget}
          style={styles.picker}>
          {assignablePlayers.map(player => (
            <Picker.Item
              key={player.id}
              label={`${player.name} (${player.roleCard})`}
              value={player.id}
            />
          ))}
        </Picker>
        <Pressable
          onPress={() => {
            const targetId = target ?? assignablePlayers[0]?.id;
            if (!targetId) {
              console.error('No target selected for buying card');
              return;
            }
            buyCardMutation.mutate({
              targetId,
              cardId,
            });
          }}
          disabled={buyButtonDisabled}
          style={
            buyButtonDisabled ? styles.buyButtonDisabled : styles.buyButton
          }>
          <Text
            style={
              buyButtonDisabled
                ? styles.buyButtonDisabledText
                : styles.buyButtonText
            }>
            Buy Card
          </Text>
        </Pressable>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1500,
  },
  box: {
    width: '85%',
    height: '50%',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  cardCost: {
    fontSize: 18,
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 20,
  },
  buyButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buyButtonDisabled: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyButtonDisabledText: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
