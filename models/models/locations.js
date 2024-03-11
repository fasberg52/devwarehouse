const { DataTypes, STRING, BIGINT } = require('sequelize');

module.exports = (sequelize) => {

  sequelize.define('Locations', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    code_id:{
        type:BIGINT,
        allowNull:true
    },
    situation:{
        type:STRING(45),
        defaultValue:'empty'
        
    }, 
    description:{
        type:STRING,
    },
    freeSituation:{
        type:STRING,
        allowNull:true,
        defaultValue:'free'
    }
  },{
    tableName: "Locations",
    createdAt: 'createdAt', // Rename the createdAt column
    updatedAt: 'updatedAt', // Rename the updatedAt column
  });

}
