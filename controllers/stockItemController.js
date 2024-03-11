const { models } = require("../models/index.js");
const moment = require("moment-jalaali");
const { Op,Sequelize, or, where } = require("sequelize");

const createStockItem = async (req, res) => {
  try {
    const stockItem = await models.StockItems.create({
      ...req.body,
      expirationDate: moment().format("YYYY-M-D 00:00:00"),
      production_date: moment().format("YYYY-M-D 00:00:00"),
      loginDate: moment().format("YYYY-M-D 00:00:00"),
    });
    res.status(201).json(stockItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllStockItems = async (req, res) => {
  try {
    const { id, page, code, name } = req.query;

    // if (id) {
    //   const stockItem = await models.StockItems.findOne({
    //     where: { id: Number(id) },
    //     include: [
    //       { model: models.Stock, as: "stock" },
    //       { model: models.Product, as: "product" },
    //       { model: models.Driver, as: "driver" },
    //       { model: models.Vehicle, as: "vehicle" },
    //     ],
    //   });

    //   res.status(200).json(stockItem);
    // } else if (code || name) {
    //   let whereObject = {};
    //   if (code && code?.length) {
    //     whereObject.code = code;
    //   }
    //   if (name && name?.length) {
    //     whereObject.name = { [Op.like]: `%${name}%` };
    //   }
    //   const stockItem = await models.StockItems.findAll({
    //     attributes: ["articleCode"],

    //     limit: 20,
    //     offset: page ? (Number(page) - 1) * 20 : 0,
    //     order: [["id", "DESC"]],
    //   });

    //   res.status(200).json(stockItem);
    // } else {
      const findLastStockItemUpdate=await models.StockItems.findOne({
        order:[['updated_at','DESC']],
      },
      {
        where:{}
      }
      );
      const findLastLocationUpdate=await models.Locations.findOne({
        order:[['updatedAt', 'DESC']]
      },
      {
        where:{}
      }
      );
      console.log(findLastLocationUpdate);
      // if(findLastStockItemUpdate.updated_at>findLastLocationUpdate.updatedAt){
        const stockItems = await models.StockItems.findAndCountAll({
          limit: 20,
          offset: page ? (Number(page) - 1) * 20 : 0,
          order: [    
            ['updated_at','DESC']],
          include: [{ model: models.Locations, as: "locations",order:[['updatedAt' , 'DESC']]}],
        });
  
        res.status(200).json(stockItems);
      // }else{
        // console.log('ok');
        // const stockItems = await models.StockItems.findAndCountAll({
        //   limit: 20,
        //   offset: page ? (Number(page) - 1) * 20 : 0,
        //   include: [{ model: models.Locations, as: "locations",order:[['updatedAt' , 'DESC']]}],
        // });
        // res.status(200).json(stockItems);
      // }
    
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getStockItemById = async (req, res) => {
  const { articleCode } = req.body;
  try {
    const product = await models.StockItems.findOne({
      where: { articleCode: articleCode },
      include: {
        model: models.Locations,
        required: false,
        as: "locations",
        order: ["updatedAt", "DESC"],
      },
    });
    if (!product) {
      res.status(404).json({ error: "StockItem not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateStockItem = async (req, res) => {
  const data = { ...req.body };
  try {
    const  updated  = await models.StockItems.update(data, {
      where: { articleCode: req.params.code },
    });
    console.log(updated);
    const update=[updated]
    if (update==0) {
      res.status(404).json({ error: "StockItem not found" });
    } else {

      const updatedStockItem = await models.StockItems.findOne({
        where: { articleCode: req.params.code },
      });
      console.log(updatedStockItem);
      res.status(200).json(updatedStockItem);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteStockItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await models.StockItems.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(200).json({ message: "محصول از انبار حذف شد" });
    } else {
      res.status(404).json({ error: "StockItem not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOneStockItem = async (req, res) => {
  try {
    const getOneStockItem = await models.StockItems.findOne({
      where: { articleCode: req.body.articleCode },
    });
    res.status(200).json(getOneStockItem);
  } catch (err) {
    res.status(500).json("internal");
  }
};

module.exports = {
  createStockItem,
  getAllStockItems,
  getStockItemById,
  updateStockItem,
  deleteStockItem,
  getOneStockItem,
};
