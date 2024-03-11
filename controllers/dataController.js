const { models } = require("../models/index.js");
const xlsx = require('node-xlsx');
const fs = require("fs");
const excelJs=require('exceljs');
const moment = require('moment-jalaali');
const { Op } = require('sequelize');



const importData = async (req, res) => {
  
  try {
    const buffer = req.file.buffer;
    const workSheetsFromBuffer = xlsx.parse(buffer);

    // const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/../storage/data.XLSX`));

    if(workSheetsFromBuffer?.[0]?.data){

        let data = workSheetsFromBuffer?.[0]?.data;

        data.shift();

        // console.log({data})
        
data.map(async item => {
  const [code, name2, name, x, y, z, box_count,bottom_box_count] = item;
  
  try {
      await sequelize.transaction(async (transaction) => {
          let product = await sequelize.models.Product.findOne({
              where: { code },
              transaction, // Pass the transaction to the query
          });

          if (!product) {
              product = await sequelize.models.Product.create({
                  name, name2, code, box_count, Image: null , bottom_box_count
              }, { transaction });
          }

          // await sequelize.models.StockItem.create({
          //     product_id: product.id,
          //     stock_id: 12,
          //     line: null,
          //     floor: null,
          //     box_count,
          //     expiration_date: null,
          // }, { transaction });
      });
      } catch (error) {
          console.error(error);
      }
});

    }

    res.status(200).json(workSheetsFromBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// const exportData = async (req, res) => {
//   try {
//     const currentDate = new Date();
//     let stockItems = await sequelize.models.StockItems.findAll({
//         limit: 20,
//         where:{
//           expiration_date: {
//             [Op.lt]: currentDate,
//           },
//         },
//         include: [
//           { model: sequelize.models.Stock, as: 'stock' },
//           { model: sequelize.models.Product, as: 'product' }
//         ]
//     });

//     const excelData = stockItems.map(item => [
//       item?.product?.code,
//       item?.product?.name,
//       item?.product?.name2,
//       item?.production_date ? moment(item?.production_date).format("jYYYY/jM/jD") : "-",
//       item?.login_date ? moment(item?.login_date).format("jYYYY/jM/jD") : "-",
//       item?.expiration_date ? moment(item?.expiration_date).format("jYYYY/jM/jD") : "-",
//       item?.box_count,
//       item?.bottom_box_count
//     ]);

//     const buffer = xlsx.build([{ name: 'products', data: excelData }]);

//     res.setHeader('Content-Disposition', 'attachment; filename="exported-data.xlsx"');
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
//     res.status(200).send(buffer);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const stockItemExcel=async (req,res)=>{
try{
 const findAllStockItems=await models.StockItems.findAll({
  limit:100,
  include:[{model:models.Locations, as:"locations"}],
  order:[['updated_at','DESC']]
 })

 let data1=[];

//  const data=findAllStockItems.map((x,index)=>{
//   data1= x.locations.map(y=>
//   [
//     x.id,
//     x.articleCode,
//     x.description,
//     x.vendorName,
//     x.pallet,
//     x.boxCountEmpty,
//     x.typeofUnloadingCar,
//     x.introductionRequirements,
//     x.depletionBy,
//     x.typeofReceiveCar,
//     x.driverName,
//     x.expirationDate,
//     x.loginDate,
//     x.floorHeight,
//     x.floor,
//     y.location
    
//   ]
//  )
// }
//  );
 for(let i=0;i<findAllStockItems.length-1;i++){
  console.log(findAllStockItems[i].locations.length);
  if(findAllStockItems[i].locations.length>0){
  for(let j=0;j<findAllStockItems[i].locations.length;j++){
    data1.push({
      id:findAllStockItems[i].id,
      articleCode:findAllStockItems[i].articleCode,
      description:findAllStockItems[i].description,
      vendorName:findAllStockItems[i].vendorName,
      pallet:findAllStockItems[i].pallet,
      boxCountEmpty:findAllStockItems[i].boxCountEmpty,
      typeofUnloadingCar:findAllStockItems[i].typeofUnloadingCar,
      introductionRequirements:findAllStockItems[i].introductionRequirements,
      depletionBy:findAllStockItems[i].depletionBy,
      typeofReceiveCar:findAllStockItems[i].typeofReceiveCar,
      driverName:findAllStockItems[i].driverName,
      expirationDate:findAllStockItems[i].expirationDate,
      loginDate:findAllStockItems[i].loginDate,
      floorHeight:findAllStockItems[i].floorHeight,
      floor:findAllStockItems[i].floor,
      location:findAllStockItems[i].locations[j].location
      
    })
  }

 }else if(findAllStockItems[i].locations.length==0) {
 data1.push({
  id:findAllStockItems[i].id,
  articleCode:findAllStockItems[i].articleCode,
  description:findAllStockItems[i].description,
  vendorName:findAllStockItems[i].vendorName,
  pallet:findAllStockItems[i].pallet,
  boxCountEmpty:findAllStockItems[i].boxCountEmpty,
  typeofUnloadingCar:findAllStockItems[i].typeofUnloadingCar,
  introductionRequirements:findAllStockItems[i].introductionRequirements,
  depletionBy:findAllStockItems[i].depletionBy,
  typeofReceiveCar:findAllStockItems[i].typeofReceiveCar,
  driverName:findAllStockItems[i].driverName,
  expirationDate:findAllStockItems[i].expirationDate,
  loginDate:findAllStockItems[i].loginDate,
  floorHeight:findAllStockItems[i].floorHeight,
  floor:findAllStockItems[i].floor,
  
})
 }
}
const workbook = new excelJs.Workbook();
const worksheet = workbook.addWorksheet('Countries List');
worksheet.columns = [
  { key: 'id', header: 'id' },
  { key: 'ارتیکل کد', header: 'ارتیکل کد', width: 25 },
  { key: 'شرح کالا', header: 'شرح کالا', width: 25 },
  { key: 'نام وندور', header: 'نام وندور ', width: 25 },
  { key: 'تعداد پالت', header: 'تعداد پالت' , width: 25},
  { key: 'تعداد در کارتن', header: 'تعداد در کارتن', width: 25 },
  { key: 'ماشین تخلیه', header: 'ماشین تخلیه', width: 25 },
  { key: 'ملزومات مصرفی', header: 'ملزومات مصرفی' , width: 25},
  { key: 'تخلیه توسط', header: 'تخلیه توسط', width: 25 },
  { key: ' ماشین دریافت', header: 'نوع ماشین دریاهت', width: 25 },
  { key: 'نام راننده', header: 'نام راننده', width: 25 },
  { key: 'تاریخ انقضا', header: 'تاریخ انقضا', width: 25 },
  { key: 'تاریخ ورود', header: 'تاریخ ورود' , width: 25},
  { key: 'ارتفاع کفچین', header: 'ارتفاع کفچین', width: 25 },
  { key: 'کفچین', header: 'کفچین', width: 25 },
  { key: 'لوکیشن ها', header: 'لوکیشن ها' , width: 70}
];
data1.forEach((item) => {
  console.log(data1.length);
  worksheet.addRow(Object.values(item));
});
 res.setHeader('Content-Disposition', 'attachment; filename="exported-data.xlsx"');
 res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
 return workbook.xlsx.write(res).then(function () {
  res.status(200).end();
});

}catch(err){
  console.log(err);
  res.status(500).json('internal')
}
}


module.exports = {
  importData,
  stockItemExcel
};
