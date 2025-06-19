import { useTRPC } from '@/api/query';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';
import { RoleCard, RoleCards } from '@/constants/RoleCards';
import { RoleButton } from './RoleButton';
import { FontAwesome } from '@expo/vector-icons';

interface RoleCardPickerProps {
  onClose: () => void;
}

/**
 * Ensure the stratego state is initialized and the user is in a lobby.
 */
export const RoleCardPicker: React.FC<RoleCardPickerProps> = ({ onClose }) => {
  const trpc = useTRPC();
  const stratego = useStrategoUnsafe();

  const availablePlayers = stratego.players.filter(
    p => p.hasRoleCard === false && p.teamId === stratego.self.teamId,
  );

  const playerTeam = stratego.lobby.teams.find(
    team => team.id === stratego.self.teamId,
  );

  const [selectedPlayerToRevive, setSelectedPlayerToRevive] = useState<string>(
    availablePlayers[0]?.id ?? '',
  );

  useEffect(() => {
    if (!availablePlayers.find(p => p.id === selectedPlayerToRevive)) {
      setSelectedPlayerToRevive(availablePlayers[0]?.id ?? '');
    }
  }, [availablePlayers, selectedPlayerToRevive]);

  const sendReviveMutation = useMutation(
    trpc.stratego.revive.mutationOptions({
      onError: error => {
        console.error('Error reviving player:', error);
      },
      onSuccess: () => {
        setSelectedPlayerToRevive('');
      },
    }),
  );

  if (availablePlayers.length === 0) {
    onClose();
    return;
  }

  if (playerTeam === undefined) {
    console.error('no team found in RoleCardPicker');
    return;
  }

  const revivePlayer = (targetPlayerId: string, roleCard: RoleCard) => {
    const selectedPlayer = stratego.players.find(
      player => player.id === targetPlayerId,
    );
    if (!selectedPlayer) {
      console.warn(`could not find player to revive, ${targetPlayerId}`);
      return;
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
        <View style={styles.title}>
          <Text style={styles.titleText}>
            Tap the role you want to give the player
          </Text>
        </View>
        <View style={styles.roleContainer}>
          {(!playerTeam.hasFlag && (
            <View style={{ alignItems: 'center' }}>
              <View style={styles.roleButtonContainer}>
                <View style={styles.vlagButton}>
                  <RoleButton
                    onPress={() =>
                      revivePlayer(selectedPlayerToRevive, RoleCards.vlag)
                    }
                    roleCard={RoleCards.vlag}
                  />
                </View>
              </View>
            </View>
          )) || (
            <View style={styles.allRoleContainer}>
              <View style={styles.roleRow}>
                <View style={styles.roleButtonContainer}>
                  <View style={styles.roleButton}>
                    <RoleButton
                      onPress={() =>
                        revivePlayer(
                          selectedPlayerToRevive,
                          RoleCards.maarschalk,
                        )
                      }
                      roleCard={RoleCards.maarschalk}
                    />
                  </View>
                  <Text style={styles.roleButtonText}>
                    {playerTeam.deck[RoleCards.maarschalk.id] ?? 0}x
                  </Text>
                </View>

                <View style={styles.roleButtonContainer}>
                  <View style={styles.roleButton}>
                    <RoleButton
                      onPress={() =>
                        revivePlayer(selectedPlayerToRevive, RoleCards.generaal)
                      }
                      roleCard={RoleCards.generaal}
                    />
                  </View>
                  <Text style={styles.roleButtonText}>
                    {playerTeam.deck[RoleCards.generaal.id] ?? 0}x
                  </Text>
                </View>

                <View style={styles.roleButtonContainer}>
                  <View style={styles.roleButton}>
                    <RoleButton
                      onPress={() =>
                        revivePlayer(selectedPlayerToRevive, RoleCards.kolonel)
                      }
                      roleCard={RoleCards.kolonel}
                    />
                  </View>
                  <Text style={styles.roleButtonText}>
                    {playerTeam.deck[RoleCards.kolonel.id] ?? 0}x
                  </Text>
                </View>
              </View>
              <View style={styles.roleRow}>
                <View style={styles.roleButtonContainer}>
                  <View style={styles.roleButton}>
                    <RoleButton
                      onPress={() =>
                        revivePlayer(selectedPlayerToRevive, RoleCards.majoor)
                      }
                      roleCard={RoleCards.majoor}
                    />
                  </View>
                  <Text style={styles.roleButtonText}>
                    {playerTeam.deck[RoleCards.majoor.id] ?? 0}x
                  </Text>
                </View>

                <View style={styles.roleButtonContainer}>
                  <View style={styles.roleButton}>
                    <RoleButton
                      onPress={() =>
                        revivePlayer(selectedPlayerToRevive, RoleCards.kapitein)
                      }
                      roleCard={RoleCards.kapitein}
                    />
                  </View>
                  <Text style={styles.roleButtonText}>
                    {playerTeam.deck[RoleCards.kapitein.id] ?? 0}x
                  </Text>
                </View>

                <View style={styles.roleButtonContainer}>
                  <View style={styles.roleButton}>
                    <RoleButton
                      onPress={() =>
                        revivePlayer(
                          selectedPlayerToRevive,
                          RoleCards.luitenant,
                        )
                      }
                      roleCard={RoleCards.luitenant}
                    />
                  </View>
                  <Text style={styles.roleButtonText}>
                    {playerTeam.deck[RoleCards.luitenant.id] ?? 0}x
                  </Text>
                </View>
              </View>
              <View style={styles.roleRow}>
                <View style={styles.roleButtonContainer}>
                  <View style={styles.roleButton}>
                    <RoleButton
                      onPress={() =>
                        revivePlayer(selectedPlayerToRevive, RoleCards.sergeant)
                      }
                      roleCard={RoleCards.sergeant}
                    />
                  </View>
                  <Text style={styles.roleButtonText}>
                    {playerTeam.deck[RoleCards.sergeant.id] ?? 0}x
                  </Text>
                </View>

                <View style={styles.roleButtonContainer}>
                  <View style={styles.roleButton}>
                    <RoleButton
                      onPress={() =>
                        revivePlayer(selectedPlayerToRevive, RoleCards.mineur)
                      }
                      roleCard={RoleCards.mineur}
                    />
                  </View>
                  <Text style={styles.roleButtonText}>
                    {playerTeam.deck[RoleCards.mineur.id] ?? 0}x
                  </Text>
                </View>

                <View style={styles.roleButtonContainer}>
                  <View style={styles.roleButton}>
                    <RoleButton
                      onPress={() =>
                        revivePlayer(selectedPlayerToRevive, RoleCards.spion)
                      }
                      roleCard={RoleCards.spion}
                    />
                  </View>
                  <Text style={styles.roleButtonText}>
                    {playerTeam.deck[RoleCards.spion.id] ?? 0}x
                  </Text>
                </View>
              </View>
              <View style={styles.roleRow}>
                <View style={styles.roleButtonContainer}>
                  <View style={styles.roleButton}>
                    <RoleButton
                      onPress={() =>
                        revivePlayer(selectedPlayerToRevive, RoleCards.bom)
                      }
                      roleCard={RoleCards.bom}
                    />
                  </View>
                  <Text style={styles.roleButtonText}>
                    {playerTeam.deck[RoleCards.bom.id] ?? 0}x
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <FontAwesome name="close" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 560,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 200,
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
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 700,
    fontSize: 12,
  },
  allRoleContainer: {},
  roleButtonContainer: {},
  roleButton: {
    height: 85,
    width: 85,
    margin: 2,
  },
  roleButtonText: {
    textAlign: 'center',
    fontWeight: 700,
  },
  roleRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 6,
    right: 12,
  },
});
