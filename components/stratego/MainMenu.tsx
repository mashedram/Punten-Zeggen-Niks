import { TeamColors } from '@/constants/Colors';
import { useStratego } from '@/hooks/game/useStratego';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';
import { useLobbyUnsafe } from '@/hooks/useLobbyUnsafe';
import { useCallback, useMemo, useState } from 'react';
import { Text } from 'react-native';
import { Button, Modal, Pressable, StyleSheet, View } from 'react-native';
import { FeedbackForm } from '../ui/FeedbackForm';
import React from 'react';
import { GameRuleOverlay, GameRuleOverlayContent } from '../ui/GameRuleOverlay';

const MainMenuPopup = ({ onClose }: { onClose: () => void }) => {
  const lobby = useLobbyUnsafe();
  const stratego = useStrategoUnsafe();

  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [isGamerulesOpen, setGamerulesOpen] = useState(false);

  const close = useCallback(() => {
    setGamerulesOpen(false);
    setFeedbackOpen(false);
    onClose();
  }, [onClose]);

  const leave = useCallback(() => {
    if (confirm('Are you sure?')) {
      lobby.leave();
    }
  }, [lobby]);

  return (
    <>
      {isFeedbackOpen && (
        <FeedbackForm onClose={() => setFeedbackOpen(false)} />
      )}
      {isGamerulesOpen && (
        <GameRuleOverlayContent onClose={() => setGamerulesOpen(false)} />
      )}
      <Modal transparent>
        <Pressable style={styles.modal} onPress={onClose}>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Flagged Victory</Text>
            </View>
            <Button
              title="Game Rules"
              color={'#70C25C'}
              onPress={() => setGamerulesOpen(true)}
            />
            <Button
              title="Feedback"
              color={'#70C25C'}
              onPress={() => setFeedbackOpen(true)}
            />
            <Button title="Close Menu" color={'#70C25C'} onPress={close} />
            <View style={styles.seperator} />
            <Button title="Leave Lobby" color={'#FF0000'} onPress={leave} />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export const MainMenu = () => {
  const [isOpen, setOpen] = useState(false);

  if (!isOpen) {
    return (
      <View style={styles.InfoButtonContainer}>
        <Pressable onPress={() => setOpen(true)}>
          <View style={styles.InfoIconContainer}>
            <Text style={styles.InfoButtonIcon}>M</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return <MainMenuPopup onClose={() => setOpen(false)} />;
};

const styles = StyleSheet.create({
  InfoButtonContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
  },

  InfoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1976d2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  InfoButtonIcon: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
  },

  modal: {
    width: '100%',
    height: '100%',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    pointerEvents: 'auto',
  },
  container: {
    width: '80%',

    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,

    display: 'flex',
    justifyContent: 'center',
    gap: 10,
  },
  seperator: {
    borderTopWidth: 1,
    height: 1,
    borderColor: '#ccc',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});
