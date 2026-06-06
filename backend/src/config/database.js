const { Sequelize } = require('sequelize');
const path = require('path');

const databaseUrl = process.env.DATABASE_URL || 'sqlite:./database.sqlite';

let sequelize;

if (
  databaseUrl.startsWith('postgres://') ||
  databaseUrl.startsWith('postgresql://')
) {
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  const dbPath = databaseUrl.replace('sqlite:', '');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../../', dbPath),
    logging: false,
  });
}

module.exports = sequelize;
