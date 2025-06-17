import { useTRPC } from '@/api/query';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';
import { useLobbyUnsafe } from '@/hooks/useLobbyUnsafe';
import { Picker } from '@react-native-picker/picker';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Button, Pressable, Text, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native';

export const FeedbackForm = () => {
  const stratego = useStrategoUnsafe();

  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [about, setAbout] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  const tRPC = useTRPC();
  const submitFeedbackMutation = useMutation(
    tRPC.feedback.submit.mutationOptions({
      onSuccess: () => {
        setIsOpen(false);
        setFeedbackType('');
        setAbout('');
        setFeedbackText('');
        alert('Feedback submitted successfully!');
      },
    }),
  );

  if (!isOpen) {
    return (
      <Pressable
        onPress={() => setIsOpen(true)}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          backgroundColor: 'lightgray',
          padding: 10,
          borderRadius: 5,
        }}>
        <Text>Open Feedback Form</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Button title="Close" onPress={() => setIsOpen(false)} />
        <Picker onValueChange={setFeedbackType} selectedValue={feedbackType}>
          <Picker.Item label="Select feedback type" value="" />
          <Picker.Item label="Bug Report" value="bug_report" />
          <Picker.Item label="Feature Request" value="feature_request" />
          <Picker.Item label="Other" value="other" />
        </Picker>
        <Picker onValueChange={setAbout} selectedValue={about}>
          <Picker.Item label="About" value="" />
          <Picker.Item label="Game Mechanics" value="game_mechanics" />
          <Picker.Item label="User Interface" value="user_interface" />
          <Picker.Item label="Other" value="other_feedback" />
        </Picker>
        <TextInput
          style={styles.textInput}
          multiline
          onChangeText={setFeedbackText}
          value={feedbackText}></TextInput>

        <Button
          title="Submit Feedback"
          onPress={() => {
            if (submitFeedbackMutation.isPending) return;
            if (!feedbackType || !about || !feedbackText) {
              alert('Please fill in all fields.');
              return;
            }
            submitFeedbackMutation.mutate({
              name: stratego.self.name,
              type: feedbackType,
              about,
              message: feedbackText,
            });
          }}
        />
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
    zIndex: 1000,

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  textInput: {
    height: 100,
    borderColor: 'gray',
    backgroundColor: 'white',
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
  },
});
