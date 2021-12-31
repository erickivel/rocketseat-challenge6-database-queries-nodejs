import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({ relations: ["games"], where: { id: user_id } });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const usersOrderedByFirstName = await this.repository.query(
      "SELECT * FROM users ORDER BY first_name"
    );

    return usersOrderedByFirstName;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const user = this.repository.query(
      `SELECT * FROM users WHERE first_name = INITCAP('${first_name}') AND last_name = INITCAP('${last_name}')`
    );

    return user;
  }
}
