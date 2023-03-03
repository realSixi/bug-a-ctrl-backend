import { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import User from '@models/users.model';

class TransactionRecord extends Model<InferAttributes<TransactionRecord>, InferCreationAttributes<TransactionRecord>> {
  declare id: CreationOptional<number>;

  declare user_id: ForeignKey<User['id']>;

  declare type: 'withdraw' | 'charge';

  declare startTime: Date;
  declare duration: number;


  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

export default TransactionRecord;
