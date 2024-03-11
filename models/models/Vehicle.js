const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

  sequelize.define('Vehicles', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },{
    tableName: "Vehicles",
    createdAt: 'createdAt', // Rename the createdAt column
    updatedAt: 'updatedAt', // Rename the updatedAt column
  });

}
