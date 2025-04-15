import { KickButton } from './KickButton';
import { SettingsButton } from './SettingsButton';
import { PlayerCount } from './PlayerCount';
import { GameStartButton } from './GameStartButton';
import { ReturnButton } from './ReturnButton';
import { PlayerList } from './PlayerList';
import { MenuButton } from './MenuButton';

export const LobbyHostScreen = () => {
  return (
    <div>
      <KickButton />
      <SettingsButton />
      <PlayerCount aantal={0} />
      <GameStartButton />
      <ReturnButton />
      <PlayerList />
      <MenuButton />
    </div>
  );
};
