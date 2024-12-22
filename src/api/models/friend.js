'use strict';
const {
  Model
} = require('sequelize');
const {REQUEST_STATUS} = require("../utils/texts");
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Friend.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user"
      });
      Friend.belongsTo(models.User, {
        foreignKey: "friend_id",
        as: "friend"
      });
    }
  }
  Friend.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.UUID
    },
    friend_id: {
      allowNull: false,
      type: DataTypes.UUID
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: REQUEST_STATUS[0]
    },
  }, {
    sequelize,
    modelName: 'Friend',
    timestamps: true,
    paranoid: true,
    tableName: 'Friends',
  });
  return Friend;
};