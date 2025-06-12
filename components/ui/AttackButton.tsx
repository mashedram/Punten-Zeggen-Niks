import { useTRPC } from '@/api/query';
import { AllRoleCards } from '@/constants/RoleCards';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';
import { useLobbyUnsafe } from '@/hooks/useLobbyUnsafe';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

export const AttackButton = () => {
  const trpc = useTRPC();
  const lobby = useLobbyUnsafe();
  const stratego = useStrategoUnsafe();

  const sendAttackMutation = useMutation(
    trpc.stratego.attack.mutationOptions({}),
  );

  const [enemyAttackCode, setEnemyAttackCode] = useState('');

  const playerCanAttack =
    AllRoleCards.find(card => card.id === stratego.self.roleCard)?.canAttack ??
    false;

  return (
    <>
      <Text>{stratego.self.attackCode}</Text>
      <TextInput
        onChangeText={text => setEnemyAttackCode(text)}
        value={enemyAttackCode}
        style={{ backgroundColor: 'white' }}
      />
      {playerCanAttack && (
        <TouchableOpacity
          style={styles.attackButtonContainer}
          onPress={() =>
            sendAttackMutation.mutate({
              token: lobby.getToken(),
              attackCode: enemyAttackCode,
            })
          }></TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  attackButtonContainer: {},
});
