import React, { useMemo } from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';
import { useLobbyUnsafe } from '@/hooks/useLobbyUnsafe';
import { useTRPC } from '@/api/query';
import { skipToken, useQuery } from '@tanstack/react-query';
import { TeamColors } from '@/constants/Colors';
import { useStrategoUnsafe } from '@/hooks/game/useStrategoUnsafe';

type Stats = {
  name: string;
  teamColor: string;
  kills: number;
  deaths: number;
};

const LeaderboardEntry = ({
  color,
  backgroundColor,
  stats,
}: {
  stats: Stats;
  color: string;
  backgroundColor: string;
}) => {
  const fontSize = 16;
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: backgroundColor,
      }}>
      <Text style={{ width: '80%', color, fontSize }}>{stats.name}</Text>
      <Text style={{ width: '8%', alignItems: 'flex-end', color, fontSize }}>
        {stats.kills}
      </Text>
      <Text style={{ width: '1%', alignItems: 'flex-end', color, fontSize }}>
        {stats.deaths}
      </Text>
    </View>
  );
};

interface GameStatusPopupProps {
  gameState: string;
  teamId: string;
  GameStateEnum: {
    playing: string;
  };
}

const GameStatusPopup: React.FC<GameStatusPopupProps> = ({
  gameState,
  teamId,
  GameStateEnum,
}) => {
  const lobby = useLobbyUnsafe();
  const stratego = useStrategoUnsafe();
  const tRPC = useTRPC();
  const isPlaying = gameState === GameStateEnum.playing;
  const isWinner = gameState === teamId && !isPlaying;
  const isLoser = gameState !== teamId && !isPlaying;
  const gameEnded = isWinner || isLoser;

  const color = TeamColors[teamId]?.color || 'black';

  const statisticsQuery = useQuery(
    tRPC.stratego.getStatistics.queryOptions(gameEnded ? undefined : skipToken),
  );

  const isAdmin = useMemo(() => {
    return lobby.get()?.self.isAdmin ?? false;
  }, [lobby]);

  const statistics = useMemo(() => {
    if (!statisticsQuery.isSuccess) {
      return null;
    }

    const values = Object.entries(statisticsQuery.data).map(([id, stats]) => {
      const player = stratego.players.find(p => p.id === id);
      const name = player?.name ?? 'Unknown';
      const teamColor = player?.teamId
        ? TeamColors[player.teamId]?.color
        : 'gray';
      return {
        name,
        teamColor,
        kills: stats.TotalKills,
        deaths: stats.TotalDeaths,
      };
    });

    values.sort((a, b) => {
      if (a.kills !== b.kills) {
        return b.kills - a.kills; // Sort by kills descending
      }
      return a.deaths - b.deaths; // Sort by deaths ascending if kills are equal
    });

    return values;
  }, [statisticsQuery.isSuccess, statisticsQuery.data, stratego.players]);

  const handleButtonPress = () => {
    lobby.setGame(null);
  };

  return (
    <Modal visible={gameEnded} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {isWinner && <Text style={styles.text}>Je hebt gewonnen</Text>}
          {isLoser && <Text style={styles.text}>Je hebt verloren</Text>}
          <View style={styles.leaderboardContainer}>
            <Text style={[styles.text, { color }]}>Leaderboard</Text>
            <View style={styles.valueContainer}>
              <View style={styles.valueContainer}>
                <LeaderboardEntry
                  key="header"
                  backgroundColor="white"
                  color="black"
                  stats={{
                    name: 'Speler',
                    teamColor: 'white',
                    // @ts-expect-error We want type checking, but this component is ever so more reusable with this in place
                    kills: 'K',
                    // @ts-expect-error We want type checking, but this component is ever so more reusable with this in place
                    deaths: 'D',
                  }}
                />
                {statistics?.map(stat => (
                  <LeaderboardEntry
                    backgroundColor={stat.teamColor}
                    color="white"
                    stats={stat}
                    key={stat.name}
                  />
                ))}
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              disabled={!isAdmin}
              title="Terug naar lobby"
              onPress={handleButtonPress}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    elevation: 10,
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    height: '90%',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    alignSelf: 'flex-end',
  },
  leaderboardContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: '80%',

    borderWidth: 1,
    borderColor: 'black',
  },
  valueContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
});

export default GameStatusPopup;
