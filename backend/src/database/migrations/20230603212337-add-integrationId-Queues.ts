import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("Queues", "integrationId", {
      type: DataTypes.INTEGER,
      references: { model: "Integrations", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn("Queues", "integrationId");
  }
};