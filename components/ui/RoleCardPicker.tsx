import { useTRPC } from '@/api/query';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';
import { useLobbyUnsafe } from '@/hooks/useLobbyUnsafe';
import { AllRoleCards } from '@/constants/RoleCards';
import { TeamColors } from '@/constants/Colors';

/**
 * Ensure the stratego state is initialized and the user is in a lobby.
 */
export const RoleCardPicker = () => {
  const trpc = useTRPC();
  const lobby = useLobbyUnsafe();
  const stratego = useStrategoUnsafe();

  const [selectedRoleCardToRevive, setSelectedRoleCardToRevive] =
    useState<string>('');
  const [selectedPlayerToRevive, setSelectedPlayerToRevive] =
    useState<string>('');

  const availableRoleCards = useQuery(
    trpc.stratego.getAvailableRoleCards.queryOptions(),
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

  const currentTeamColor =
    stratego.self.teamId === 'red'
      ? TeamColors.red.color
      : TeamColors.blue.color;

  return (
    <>
      <Picker
        style={styles.SelectFieldContainer}
        selectedValue={selectedPlayerToRevive}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedPlayerToRevive(itemValue);
        }}>
        <Picker.Item label="Select player" value="" />
        {stratego.players
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
      <Picker
        style={[styles.SelectFieldContainer, { marginTop: 5 }]}
        selectedValue={selectedRoleCardToRevive}
        prompt="Select role card to revive"
        onValueChange={(itemValue, itemIndex) => {
          setSelectedRoleCardToRevive(itemValue);
        }}>
        <Picker.Item label="Select role card" value="" />
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
      <TouchableOpacity
        style={[
          styles.ReviveButton,
          {
            backgroundColor: currentTeamColor,
          },
        ]}
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
        }}>
        <Text style={styles.ButtonText}>Revive</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  SelectFieldContainer: {
    width: '100%',
    height: 35,
    borderRadius: 5,
    borderColor: 'black',
    alignSelf: 'center',
  },
  ReviveButton: {
    alignSelf: 'center',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    borderRadius: 5,
    shadowColor: 'black',
    marginTop: 15,
  },
  ButtonText: {
    fontWeight: 700,
    color: 'white',
  },
  text: {
    fontWeight: 700,
    fontSize: 12,
  },
});
