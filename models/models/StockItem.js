const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('StockItems', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    articleCode:{
      type:DataTypes.STRING
    },
    description:{
      type:DataTypes.STRING
    },
    vendorName:{
      type:DataTypes.STRING
    },
    pallet:{
      type:DataTypes.STRING
    },
    boxCountEmpty:{
      type:DataTypes.STRING
    },
    typeofUnloadingCar:{
      type:DataTypes.STRING
    },
    introductionRequirements:{
      type:DataTypes.STRING
    },
    depletionBy:{
      type:DataTypes.STRING
    },
    typeofReceiveCar:{
      type:DataTypes.STRING
    },
    driverName:{
      type:DataTypes.STRING
    },
    product_id: {
      type: DataTypes.BIGINT,
    },
    stock_id: {
      type: DataTypes.BIGINT,
    },
    driver_id: {
      type: DataTypes.BIGINT,
    },
    vehicle_id: {
      type: DataTypes.BIGINT,
    },
    location: {
      type: DataTypes.STRING,
    },
    line: {
      type: DataTypes.STRING,
    },
    floor: {
      type: DataTypes.STRING,
    },
    floorHeight:{
      type:DataTypes.STRING
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    loginDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    production_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    bin:{
      type:DataTypes.STRING
    },
  },{
    tableName: "StockItems",
    createdAt: 'created_at', // Rename the createdAt column
    updatedAt: 'updated_at', // Rename the updatedAt column
  });
}

// StockItem.associate = function(models) {
//   console.log({models})
//   StockItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
//   StockItem.belongsTo(models.Stock, { foreignKey: 'stock_id', as: 'stock' });
// };

// StockItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
// StockItem.belongsTo(Stock, { foreignKey: 'stock_id', as: 'stock' });