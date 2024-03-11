function applyExtraSetup(sequelize) {
	const { StockItems ,Stock, Product,Driver,Vehicles,Locations } = sequelize.models;

	// Stock.hasMany(Product,{ as : "product", foreignKey:"product_id" });
	// Stock.hasMany(StockItem, { as : "stock_items", foreignKey:"stock_id" });
	StockItems.belongsTo(Stock, { as : "stock", foreignKey:"stock_id" });
	StockItems.belongsTo(Product, { as : "product", foreignKey:"product_id",foreignKeyConstraint:true });
	StockItems.belongsTo(Driver, { as : "driver", foreignKey:"driver_id",foreignKeyConstraint:true });
	StockItems.belongsTo(Vehicles, { as : "vehicles", foreignKey:"vehicle_id" });
	StockItems.hasMany(Locations, { foreignKey:'code_id',sourceKey:"articleCode",as:'locations'});
	Locations.belongsTo(StockItems,{foreignKey:'code_id',as:'locations'});
}

module.exports = { applyExtraSetup };