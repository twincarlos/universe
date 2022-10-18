'use strict';
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false
    },
    profilePicture: {
      type: DataTypes.STRING
    }
  },
    {
      defaultScope: {
        attributes: {
          exclude: ['hashedPassword', 'createdAt', 'updatedAt']
        }
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ['hashedPassword'] }
        },
        loginUser: {
          attributes: {}
        }
      }
    });

  User.prototype.toSafeObject = function () { // remember, this cannot be an arrow function
    const { id, username, profilePicture } = this; // context will be the User instance
    return { id, username, profilePicture };
  };

  User.getCurrentUserById = async function (id) {
    return await User.scope('currentUser').findByPk(id);
  };

  User.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString());
  };

  User.login = async function ({ username, password }) {
    const { Op } = require('sequelize');
    const user = await User.scope('loginUser').findOne({ where: { username } });
    if (user && user.validatePassword(password)) {
      return await User.scope('currentUser').findByPk(user.id);
    }
  };

  User.signup = async function ({ username, password }) {
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ username, hashedPassword });
    return await User.scope('currentUser').findByPk(user.id);
  };

  User.associate = function (models) {
    // associations can be defined here
  };

  return User;
};
