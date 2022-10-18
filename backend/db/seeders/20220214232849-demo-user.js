'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        username: 'Demo1',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        username: 'Demo2',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        username: 'Demo3',
        hashedPassword: bcrypt.hashSync('password')
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo1', 'Demo2', 'Demo3'] }
    }, {});
  }
};
