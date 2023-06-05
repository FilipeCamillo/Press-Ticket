import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("Integrations", "url", {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: true
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn("Integrations", "url");
  }
};