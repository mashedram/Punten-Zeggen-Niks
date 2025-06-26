import { Client } from '@/common/networking/client/Client';
import { Player } from '../lobby/Player';
import { Lobby } from '../lobby/Lobby';

const PlayerStatisticKeys = ['TotalKills', 'TotalDeaths'] as const;
type PlayerStatisticKeysType = (typeof PlayerStatisticKeys)[number];

class StatisticInstance {
  private _values: Record<string, number> = {};

  public increment(client: Client | Player, value: number = 1) {
    const key = client.getId();

    this._values[key] = (this._values[key] ?? 0) + value;

    console.debug(`Incremented statistic for ${key}: ${value}.`);
  }

  public get(client: Client | Player): number {
    const key = client.getId();
    return this._values[key] ?? 0;
  }

  public getAll(): Record<string, number> {
    return { ...this._values };
  }

  public clear() {
    this._values = {};
  }
}

export class StatisticsContainer {
  private _owner: Lobby;
  private _instances: Record<PlayerStatisticKeysType, StatisticInstance>;
  private _report: Record<
    string,
    Record<PlayerStatisticKeysType, number>
  > | null;

  constructor(owner: Lobby) {
    this._owner = owner;
    this._report = null;

    this._instances = {} as Record<PlayerStatisticKeysType, StatisticInstance>;
    for (const key of PlayerStatisticKeys) {
      this._instances[key] = new StatisticInstance();
    }
  }

  public add(
    key: PlayerStatisticKeysType,
    client: Client | Player,
    value: number = 1,
  ) {
    if (!this._instances[key]) {
      throw new Error(`Statistic key ${key} does not exist`);
    }

    this._instances[key].increment(client, value);
  }

  public clear() {
    for (const key of PlayerStatisticKeys) {
      this._instances[key].clear();
    }
    this._report = null;
  }

  public buildReport() {
    this._report = {};

    for (const player of this._owner.getPlayers()) {
      const playerId = player.getId();
      this._report[playerId] = {} as Record<PlayerStatisticKeysType, number>;

      for (const key of PlayerStatisticKeys) {
        this._report[playerId][key] = this._instances[key].get(player);
      }
    }

    console.debug(
      `Built statistics report for lobby ${this._owner.getCode()}:`,
      this._report,
      this._instances,
    );

    return this._report;
  }

  public getReport(): Record<string, Record<PlayerStatisticKeysType, number>> {
    if (this._report === null) {
      this.buildReport();
    }

    return this._report!;
  }

  public static increment(
    key: PlayerStatisticKeysType,
    player: Player,
    value: number = 1,
  ) {
    const lobby = player.getLobby();
    const statistics = lobby.getStatistics();

    statistics.add(key, player, value);
  }
}
