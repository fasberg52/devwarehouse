const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {

  sequelize.define('Stock', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
    },
  },{
    tableName: "Stock",
    createdAt: 'created_at', // Rename the createdAt column
    updatedAt: 'updated_at', // Rename the updatedAt column
  });

}


// Stock.associate = function(models) {
//   Stock.hasMany(models.StockItem, { foreignKey: 'stock_id', as: 'stock_item' });
// };

// Stock.hasMany(StockItem, { foreignKey: 'stock_id', as: 'stock_item' });

// module.exports = Stock;
