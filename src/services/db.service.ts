import { DataTypes, Sequelize, STRING } from 'sequelize';
import User from '@models/users.model';
import TransactionRecord from '@models/transaction.model';
import {DB_NAME, DB_USERNAME, DB_PORT, DB_HOST, DB_PASSWORD} from "@config";

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD ,{
  dialect: 'mariadb',
  host: DB_HOST,
  port: Number.parseInt(DB_PORT)
});

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    username: {
      type: STRING,
    },
    apikey: {
      type: STRING,
      unique: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'users',
    sequelize,
    indexes: [
      {
        type: 'UNIQUE',
        fields: ['apikey'],
      },
    ],
  },
);

TransactionRecord.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    type: {
      type: DataTypes.STRING,
    },
    startTime: {
      type: DataTypes.DATE,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'transactionRecord',
    sequelize,
    indexes: [
      {
        fields: ['startTime'],
      },
      {
        fields: ['user_id'],
      },
    ],
  },
);

User.hasMany(TransactionRecord, {
  sourceKey: 'id',
  foreignKey: 'user_id',
  as: 'transactionRecords',
});

const initDatabase = async () => {
  await sequelize.sync({});
};

export default {
  initDatabase,
} as const;
