import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';
import { UserRefreshToken } from './user_refresh_token.model';

@Table({
  tableName: 'users',
  schema: 'myapp', // Specify the custom schema here
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4, // Automatically generates a UUID
    primaryKey: true, // Ensures this is the primary key
  })
  id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastname: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address: string;

  @HasOne(() => UserRefreshToken)
  refreshToken: UserRefreshToken;
}
