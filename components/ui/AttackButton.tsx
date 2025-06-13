import { useTRPC } from '@/api/query';
import { TeamColors } from '@/constants/Colors';
import { AllRoleCards } from '@/constants/RoleCards';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';
import { useLobbyUnsafe } from '@/hooks/useLobbyUnsafe';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';

export const AttackButton = () => {
  const trpc = useTRPC();
  const lobby = useLobbyUnsafe();
  const stratego = useStrategoUnsafe();

  const sendAttackMutation = useMutation(
    trpc.stratego.attack.mutationOptions({}),
  );

  const [enemyAttackCode, setEnemyAttackCode] = useState('');

  const playerRoleCard = AllRoleCards.find(
    card => card.id === stratego.self.roleCard,
  );
  const currentTeamColor =
    stratego.self.teamId === 'red'
      ? TeamColors.red.color
      : TeamColors.blue.color;

  return (
    <View style={styles.container}>
      <View style={styles.attackCodeContainer}>
        <Text>Your attack code:</Text>
        <Text style={styles.attackCodeText}>{stratego.self.attackCode}</Text>
      </View>

      {((playerRoleCard?.canAttack ?? false) && (
        <>
          <View style={styles.codeInputContainer}>
            <TextInput
              placeholder="Enter enemy attack code here"
              onChangeText={text => setEnemyAttackCode(text)}
              value={enemyAttackCode}
              style={styles.codeInput}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.attackButtonContainer,
              { backgroundColor: currentTeamColor },
            ]}
            onPress={() =>
              sendAttackMutation.mutate({
                token: lobby.getToken(),
                attackCode: enemyAttackCode,
              })
            }>
            <Text style={styles.buttonText}>Attack</Text>
          </TouchableOpacity>
        </>
      )) || (
        <View style={styles.cantAttackContainer}>
          {(playerRoleCard === undefined && (
            <Text style={[{ textAlign: 'center' }]}>
              You don't have a role yet
            </Text>
          )) || (
            <Text style={[{ textAlign: 'center' }]}>
              Your role can't attack
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
  },
  attackCodeContainer: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
  },
  attackCodeText: {
    fontWeight: 700,
    fontSize: 25,
  },
  codeInputContainer: {
    marginTop: 20,
  },
  codeInput: {
    backgroundColor: '#c1cece',
    height: 30,
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 5,
  },
  attackButtonContainer: {
    marginTop: 10,
    alignSelf: 'center',
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: 700,
    color: 'white',
  },
  cantAttackContainer: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    height: 25,
  },
});
