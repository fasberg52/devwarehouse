const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

  sequelize.define('Product', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
    },
    box_count: {
      type: DataTypes.BIGINT,
    },
    bottom_box_count: {
      type: DataTypes.BIGINT,
    },
  },{
    tableName: "Product",
    createdAt: 'created_at', // Rename the createdAt column
    updatedAt: 'updated_at', // Rename the updatedAt column
  });

}

// Product.associate = function(models) {
//   Product.hasMany(models.StockItem, { foreignKey: 'stock_id', as: 'stock_item' });
// };

// Stock.hasMany(StockItem, { foreignKey: 'stock_id', as: 'stock_item' });

// module.exports = Product;
