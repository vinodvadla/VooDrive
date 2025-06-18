"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Resource extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "ownerId",
        as: "owner",
      });
      this.belongsTo(models.Resource, {
        foreignKey: "parentId",
        as: "parent",
      });
    }
  }

  Resource.init(
    {
      ownerId: { type: DataTypes.INTEGER, allowNull: false },
      type: { type: DataTypes.ENUM("FOLDER", "FILE") },
      mimetype: { type: DataTypes.STRING, allowNull: false },
      parentId: { type: DataTypes.INTEGER, allowNull: true },
      name: { type: DataTypes.STRING, allowNull: false },
      size: DataTypes.INTEGER,
      file_url: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "Resource",
    }
  );
  return Resource;
};
