import { useTRPC } from '@/api/query';
import { TeamColors } from '@/constants/Colors';
import { AllRoleCards } from '@/constants/RoleCards';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import { AttackQrCode } from './AttackQrCode';

export const AttackButton = () => {
  const trpc = useTRPC();
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
      <View
        style={[styles.attackCodeContainer, { borderColor: currentTeamColor }]}>
        <Text>Je zit in team:</Text>
        <Text
          style={{ fontWeight: 'bold', fontSize: 20, color: currentTeamColor }}>
          {stratego.self.teamId.toUpperCase()}
        </Text>
        <Text>Je aanvals code:</Text>
        <Text style={styles.attackCodeText}>{stratego.self.attackCode}</Text>
        <Text style={[{ fontSize: 12, textAlign: 'center' }]}>
          Druk op de rol kaart om de QR-code te laten zien.
        </Text>
      </View>

      <View style={styles.codeInputContainer}>
        <TextInput
          placeholder="Vul hier de aanvalscode in"
          onChangeText={text => setEnemyAttackCode(text)}
          autoComplete="off"
          autoCorrect={false}
          value={enemyAttackCode}
          style={[styles.codeInput, { borderColor: currentTeamColor }]}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.attackButtonContainer,
          { backgroundColor: currentTeamColor },
        ]}
        onPress={() => {
          if (playerRoleCard?.canAttack) {
            sendAttackMutation.mutate({
              attackCode: enemyAttackCode,
            });
          }
        }}>
        <Text style={styles.buttonText}>aanvallen</Text>
      </TouchableOpacity>
      <View style={styles.qrContainer}>
        <AttackQrCode
          onQrScan={qrAttackCode => {
            if (playerRoleCard?.canAttack) {
              sendAttackMutation.mutate({ attackCode: qrAttackCode });
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  attackCodeContainer: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 3,
    padding: 5,
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
    borderWidth: 3,
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
  qrContainer: {},
});
