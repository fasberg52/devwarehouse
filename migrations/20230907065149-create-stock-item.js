'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('StockItems', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      articleCode:{
        type:Sequelize.STRING
      },
      description:{
        type:Sequelize.STRING
      },
      code:{
        type:Sequelize.STRING,
        unique:false
      },
      vendorName:{
        type:Sequelize.STRING
      },
      pallet:{
        type:Sequelize.STRING
      },
      boxCountEmpty:{
        type:Sequelize.STRING
      },
      typeofUnloadingCar:{
        type:Sequelize.STRING
      },
      introductionRequirements:{
        type:Sequelize.STRING
      },
      depletionBy:{
        type:Sequelize.STRING
      },
      typeofReceiveCar:{
        type:Sequelize.STRING
      },
      driverName:{
        type:Sequelize.STRING
      },
      product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      stock_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      driver_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      vehicle_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
      },
      line: {
        type: Sequelize.STRING,
      },
      floor: {
        type: Sequelize.STRING,
      },
      floorHeight:{
        type:Sequelize.STRING
      },
      expirationDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      loginDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      production_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('StockItems');
  },
};
