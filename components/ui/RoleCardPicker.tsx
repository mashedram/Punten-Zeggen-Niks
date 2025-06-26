import { useTRPC } from '@/api/query';
import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useMemo, useState } from 'react';
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

  const availablePlayers = useMemo(() => {
    return stratego.players.filter(
      p => p.hasRoleCard === false && p.teamId === stratego.self.teamId,
    );
  }, [stratego.players, stratego.self.teamId]);

  const playerTeam = stratego.lobby.teams.find(
    team => team.id === stratego.self.teamId,
  );

  const [target, setTarget] = useState<string | null>(null);

  const sendReviveMutation = useMutation(
    trpc.stratego.revive.mutationOptions({
      onError: error => {
        console.error('Error reviving player:', error);
      },
      onSuccess: () => {
        setTarget(null);
      },
    }),
  );

  const sendAssignFlagMutation = useMutation(
    trpc.stratego.assignFlag.mutationOptions({
      onError: error => {
        console.error('Error assigning a flag', error);
      },
      onSuccess: () => {
        setTarget(null);
      },
    }),
  );

  const getTargetId = useCallback(() => {
    if (target) {
      return target;
    }
    return availablePlayers[0]?.id;
  }, [target, availablePlayers]);

  const revivePlayer = useCallback(
    (roleCard: RoleCard) => {
      const targetId = getTargetId();
      if (!targetId) {
        console.warn(`could not find player to revive, ${targetId}`);
        return;
      }
      sendReviveMutation.mutate({
        targetId,
        roleCard: roleCard.id,
      });
    },
    [getTargetId, sendReviveMutation],
  );

  const assignFlag = useCallback(() => {
    const targetId = getTargetId();

    if (!targetId) {
      console.warn(`could not find player to assign flag, ${targetId}`);
      return;
    }
    sendAssignFlagMutation.mutate(targetId);
  }, [getTargetId, sendAssignFlagMutation]);

  if (availablePlayers.length === 0) {
    onClose();
    return;
  }

  if (playerTeam === undefined) {
    console.error('no team found in RoleCardPicker');
    return;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Select a player to revive</Text>
        </View>
        <View style={styles.playerContainer}>
          <Picker
            style={styles.playerPicker}
            selectedValue={target}
            onValueChange={(itemValue, itemIndex) => {
              setTarget(itemValue);
            }}>
            {availablePlayers.map(player => {
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
                    onPress={() => revivePlayer(RoleCards.vlag)}
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
                      onPress={() => revivePlayer(RoleCards.maarschalk)}
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
                      onPress={() => revivePlayer(RoleCards.generaal)}
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
                      onPress={() => revivePlayer(RoleCards.kolonel)}
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
                      onPress={() => revivePlayer(RoleCards.majoor)}
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
                      onPress={() => revivePlayer(RoleCards.kapitein)}
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
                      onPress={() => revivePlayer(RoleCards.luitenant)}
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
                      onPress={() => revivePlayer(RoleCards.sergeant)}
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
                      onPress={() => revivePlayer(RoleCards.mineur)}
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
                      onPress={() => revivePlayer(RoleCards.spion)}
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
                      onPress={() => revivePlayer(RoleCards.bom)}
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
