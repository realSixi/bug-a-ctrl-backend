import {
  Association,
  CreationOptional,
  HasManyAddAssociationMixin, HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import TransactionRecord from '@models/transaction.model';

class User extends Model<InferAttributes<User, { omit: 'transactionRecords' }>, InferCreationAttributes<User, { omit: 'transactionRecords' }>> {
  declare id: CreationOptional<number>;
  declare username: string;

  declare apikey: string;

  declare getTransactionRecords: HasManyGetAssociationsMixin<TransactionRecord>;
  declare createTransactionRecord: HasManyCreateAssociationMixin<TransactionRecord, 'id'>;
  declare addTransactionRecord: HasManyAddAssociationMixin<TransactionRecord, number>;

  declare transactionRecords?: NonAttribute<TransactionRecord[]>;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;

  declare static associations: {
    transactionRecords: Association<User, TransactionRecord>;
  };
}

export default User;
