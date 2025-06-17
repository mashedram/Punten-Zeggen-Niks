import { useTRPC } from '@/api/query';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';
import { useLobbyUnsafe } from '@/hooks/useLobbyUnsafe';
import { RoleCard, RoleCards } from '@/constants/RoleCards';
// import { TeamColors } from '@/constants/Colors';
import { RoleButton } from './RoleButton';

/**
 * Ensure the stratego state is initialized and the user is in a lobby.
 */
export const RoleCardPicker = () => {
  const trpc = useTRPC();
  const lobby = useLobbyUnsafe();
  const stratego = useStrategoUnsafe();

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

  // const currentTeamColor =
  //   stratego.self.teamId === 'red'
  //     ? TeamColors.red.color
  //     : TeamColors.blue.color;

  const revivePlayer = (targetPlayerId: string, roleCard: RoleCard) => {
    const players = lobby.get()?.players ?? [];
    const selectedPlayer = players.find(player => player.id === targetPlayerId);
    if (!selectedPlayer) {
      console.warn('could not find player');
    }
    sendReviveMutation.mutate({
      targetId: targetPlayerId,
      roleCard: roleCard.id,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Select a player to revive</Text>
        </View>
        <View style={styles.playerContainer}>
          <Picker
            style={styles.playerPicker}
            selectedValue={selectedPlayerToRevive}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedPlayerToRevive(itemValue);
            }}>
            <Picker.Item label="Select player" value="" />
            {stratego.players
              .filter(
                p =>
                  p.hasRoleCard === false && p.teamId === stratego.self.teamId,
              )
              .map(player => {
                return (
                  <Picker.Item
                    key={player.id}
                    label={player.name}
                    value={player.id}
                  />
                );
              })}
          </Picker>
        </View>
        <View style={styles.roleContainer}>
          {availableRoleCards.data &&
            Object.entries(availableRoleCards.data).some(
              ([card, count]) => card === RoleCards.vlag.id,
            ) && (
              <View style={{ alignItems: 'center' }}>
                <View style={styles.vlagButton}>
                  <RoleButton
                    onPress={() =>
                      revivePlayer(selectedPlayerToRevive, RoleCards.vlag)
                    }
                    roleCard={RoleCards.vlag}
                  />
                </View>
              </View>
            )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 450,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 200,
    zIndex: 100,
  },
  content: {
    height: '100%',
    width: '100%',
  },
  title: {
    width: '100%',
    marginTop: 5,
  },
  titleText: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 18,
  },
  playerContainer: {
    marginTop: 20,
  },
  roleContainer: {
    marginTop: 10,
    width: '100%',
    backgroundColor: 'white',
  },
  playerPicker: {
    width: '90%',
    height: 35,
    borderRadius: 5,
    borderColor: 'black',
    alignSelf: 'center',
  },
  vlagButton: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 700,
    fontSize: 12,
  },
});
