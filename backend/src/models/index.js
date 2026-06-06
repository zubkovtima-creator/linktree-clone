const sequelize = require('../config/database');
const User = require('./User');
const Link = require('./Link');

User.hasMany(Link, { foreignKey: 'user_id', as: 'links' });
Link.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Link,
};
