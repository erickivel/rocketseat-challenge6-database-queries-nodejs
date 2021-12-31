import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const lowerCaseParam = param.toLowerCase();

    const games = await this.repository
      .createQueryBuilder("game")
      .where(`game.title ILIKE '%${param}%'`)
      .getMany();

    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const countGames = await this.repository.query(
      `SELECT COUNT(id) FROM games`
    );

    return countGames;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository
      .createQueryBuilder("game")
      .leftJoinAndSelect("game.users", "user")
      .where("game.id = :id", { id: id })
      .getOne();

    if (!game?.users) {
      throw new Error("User does not have games");
    }

    return game.users;
  }
}
