import { useTRPC } from '@/api/query';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';
import { useLobbyUnsafe } from '@/hooks/useLobbyUnsafe';
import { AllRoleCards } from '@/constants/RoleCards';

/**
 * Ensure the stratego state is initialized and the user is in a lobby.
 */
export const RolePicker = () => {
  const trpc = useTRPC();
  const lobby = useLobbyUnsafe();
  const stratego = useStrategoUnsafe();

  const [selectedRoleCardToRevive, setSelectedRoleCardToRevive] =
    useState<string>('Select role card');
  const [selectedPlayerToRevive, setSelectedPlayerToRevive] =
    useState<string>('Select player');

  const availableRoleCards = useQuery(
    trpc.stratego.getAvailableRoleCards.queryOptions({
      token: lobby.getToken(),
    }),
  );

  const sendReviveMutation = useMutation(
    trpc.stratego.revive.mutationOptions({
      onError: error => {
        console.error('Error reviving player:', error);
      },
      onSuccess: () => {
        availableRoleCards.refetch();
        setSelectedPlayerToRevive('Select player');
      },
    }),
  );

  return (
    <>
      <Picker
        style={styles.SelectFieldContainer}
        selectedValue={selectedRoleCardToRevive}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedRoleCardToRevive(itemValue);
        }}>
        {availableRoleCards.data &&
          Object.entries(availableRoleCards.data).map(([roleCard, count]) => {
            return (
              <Picker.Item
                key={roleCard}
                label={`${roleCard}, ${count} available`}
                value={roleCard}
              />
            );
          })}
      </Picker>
      <Picker
        style={styles.SelectFieldContainer}
        selectedValue={selectedPlayerToRevive}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedPlayerToRevive(itemValue);
        }}>
        {stratego.otherPlayers
          .filter(
            p => p.hasRoleCard === false && p.teamId === stratego.self.teamId,
          )
          .map(player => {
            return (
              <Picker.Item
                key={player.id}
                label={player.id}
                value={player.id}
              />
            );
          })}
      </Picker>
      <Button
        onPress={() => {
          if (selectedRoleCardToRevive && selectedPlayerToRevive) {
            const players = lobby.get()?.players ?? [];
            const selectedPlayer = players.find(
              player => player.id === selectedPlayerToRevive,
            );
            const selectedRoleCard = AllRoleCards.find(
              card => card.id === selectedRoleCardToRevive,
            );
            if (!selectedPlayer || !selectedRoleCard) {
              console.error(
                `invalid selection, no player or rol selected: ${selectedPlayerToRevive}, ${selectedRoleCardToRevive}`,
              );
              return;
            }
            sendReviveMutation.mutate({
              token: lobby.getToken(),
              targetId: selectedPlayer.id,
              roleCard: selectedRoleCard.id,
            });
          }
        }}
        title="Revive"
      />
    </>
  );
};

const styles = StyleSheet.create({
  SelectFieldContainer: {
    width: '70%',
    height: '10%',
    marginTop: 10,
    marginLeft: 50,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
});
