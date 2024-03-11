const { models } = require('../models/index.js');

const createProduct = async (req, res) => {
  try {
    const { code,name,name2,box_count,bottom_box_count,floor_height } = req.body;
    let publicUrl = null;    

    if (req.image) {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      publicUrl = `/uploads/${year}/${month}/${day}`;    
    }
    name
    const product = await models.Product.create({ box_count,bottom_box_count,code, name, image : publicUrl, name2,floor_height });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { id, page } = req.query;
    if(id){
      const product = await models.Product.findOne({
       where:{id:Number(id)}
      });
      res.status(200).json(product);
    }else{
      const products = await models.Product.findAndCountAll({
        limit: 20,
        offset: page ? (Number(page) - 1) * 20 : 0,
        order: [['id', 'DESC']],
      });
      res.status(200).json(products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error', error });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await models.Product.findByPk(id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { code, name , name2,box_count,bottom_box_count } = req.body;
  try {
    const [updated] = await models.Product.update({ box_count,bottom_box_count,code, name, name2 }, {
      where: { id },
    });
    if (updated) {
      const updatedProduct = await models.Product.findByPk(id);
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await models.Product.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(200).json({ message: 'محصول حذف شد' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
