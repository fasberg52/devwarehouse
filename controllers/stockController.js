const { models } = require('../models/index.js');


const createStock = async (req, res) => {
  try {
    const { code, name, image } = req.body;
    const stock = await models.Stock.create({ code, name, image });
    res.status(201).json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllStocks = async (req, res) => {
  try {
    const { id, page } = req.query;

    if(id){
      const stock = await models.Stock.findOne({
        where:{id:Number(id)}
      });
      res.status(200).json(stock);
    }else{
      const stocks = await models.Stock.findAndCountAll({
        limit: 20,
        offset: page ? (Number(page) - 1) * 20 : 0,
        order: [['id', 'DESC']],
      });
      res.status(200).json(stocks);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getStockById = async (req, res) => {
  const { id } = req.params;
  try {
    const stock = await models.Stock.findByPk(id);
    if (!stock) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateStock = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await models.Stock.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedStock = await models.Stock.findByPk(id);
      res.status(200).json(updatedStock);
    } else {
      res.status(404).json({ error: 'Stock not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteStock = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await models.Stock.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(200).json({ message: 'انبار حذف شد' });
    } else {
      res.status(404).json({ error: 'Stock not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

};




module.exports = {
  createStock,
  getAllStocks,
  getStockById,
  updateStock,
  deleteStock,

};
