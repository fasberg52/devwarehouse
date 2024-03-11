const { Op, Sequelize, QueryTypes, or } = require("sequelize");
const readxslx = require("read-excel-file/node");
const path = require("path");
const { models } = require("../models/index");
const XLSX = require("xlsx");
const axios = require("axios");

module.exports = class LocationService {
  async insertLocations(excelFile) {
    let results = [];
    const excelPath = path.join(
      __dirname,
      "../uploads",
      excelFile.originalname
    );
    const workbook = XLSX.readFile(excelPath);
    const sheet_name_list = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    );
    xlData.map(async (x) => {
      const data = Object.values(x);
      data.map(async (y) => {
        await models.Locations.create({ location: y });
      });
    });

    return {
      status: 200,
      message: "ok",
    };
  }

  async fillLocation(request) {
    const { location } = request;
    const findLocation = await models.Locations.findOne({
      where: { location: location },
    });
    if (!findLocation) {
      return {
        status: 400,
        message: "location not exist",
      };
    } else {
      return await this.fillLocationProcsess(request, findLocation);
    }
  }

  async fillLocationProcsess(request, findedLocation) {
    if (findedLocation.situation === "empty") {
      const updateLocation= await models.Locations.update(request, {
        where: { location: findedLocation.location },
      });
      const updatedLocation=[updateLocation]
      if(updatedLocation==0){
        return{
          status:400,
          message:'location not update'
        }
      }
      const result = await models.Locations.findByPk(findedLocation.id);
      console.log(result.updatedAt,request.code_id);
      const updateDateOfStockItem= await models.StockItems.update({
       articleCode:request.code_id
      },
      {
        where:{articleCode:request.code_id}
      }
      );
      const update= [updateDateOfStockItem];
      if(update==0){
        return{
          status:400,
          message:'not update'
        }
      }else{
      return {
        status: 201,
        message: result,
      };
    }
    } else {
      return {
        status: 400,
        message: "loaction is fill",
      };
    }
  }
  async fillLocations(request){
    const { location } = request;
    const findLocation = await models.Locations.findOne({
      where: { location: location },
    });
    if (!findLocation) {
      return {
        status: 400,
        message: "location not exist",
      };
    } else {
      return await this.fillLocationsProcsess(request, findLocation);
    }
    
  }
  async fillLocationsProcsess(request, findedLocation) {
      const updateLocation= await models.Locations.update({freeSituation:request.freeSituation}, {
        where: { location: request.location },
      });
      const updatedLocation=[updateLocation]
      if(updatedLocation==0){
        return{
          status:400,
          message:'location not update'
        }
      }
      const result = await models.Locations.findByPk(findedLocation.id);
      console.log(request);
      // const updateDateOfStockItem= await models.StockItems.update({
      //   articleCode:request.articleCode
      // },
      // {
      //   where:{articleCode:request.articleCode}
      // }
      // );
      // const update=[updateDateOfStockItem]
      // if(update==0){
      //   return{
      //     status:400,
      //     message:'not update'
      //   }
      // }
      return {
        status: 201,
        message: result,
      };
    
  }

  async fillPallet(request) {
    var obj = [];
    const result = request.map(async (x) => {
      const [update] = await models.Locations.update(x, {
        where: { location: x.location },
      });
      obj.push(update);
      if (obj.includes(0)) {
        return {
          status: 400,
          message: obj,
        };
      } else {
        return {
          status: 200,
          message: obj,
        };
      }
    });
    console.log(await result[0]);
    // console.log(await result[0]);
    return {
      status: await result.status,
      message: await result.message,
    };
  }

  async setLocationEqualEmpty() {
    const setLocationEqualEmpty = await models.Locations.update(
      { situation: "empty",
      code_id:null,
      freeSituation:'free',
      description:null

     },
     {
      where:{}
     }
      
    );
   const updateAllLocations=[setLocationEqualEmpty]
   if(updateAllLocations.length==0){
    return{
      status:400,
      message:'not update'
    }
   }else{
    return {
      status: 200,
      message: 'updated',
    };
  }
  }

  //---------------------------------
  // start logic for orderBySituation

  async orderBySituation(request) {
    const limitNumber = Math.ceil(request);
    const after = await models.Locations.findAll({
      order: [["location", "ASC"]],
      where: {
        location: {
          [Op.between]: ["A0111", "T2337"],
          [Op.notLike]: "%1",
        },
        situation: {
          [Op.eq]: "empty",
        },
        freeSituation: {
          [Op.eq]: "free",
        },
      },
      limit: limitNumber,
    });
    const before = await models.Locations.findAll({
      order: [["location", "DESC"]],
      where: {
        location: {
          [Op.between]: ["A0111", ``],
        },
        situation: {
          [Op.eq]: "empty",
        },
        freeSituation: {
          [Op.eq]: "free",
        },
      },
      limit: limitNumber,
    });
    return {
      status: 200,
      message: {
        after,
      },
    };
  }

  async findOneLocation(request) {
    const findOneLocation = await models.Locations.findOne({
      where: { location: request.location },
    });
    if (findOneLocation) {
      return {
        status: 200,
        message: findOneLocation,
      };
    } else {
      return {
        status: 404,
        message: "loaction not found",
      };
    }
  }

  async listOfValidCharacterAndNumberOfLocation() {
    let character = [];
    let Number1 = [];
    let Number2 = [];
    let Number3 = [];
    let Number4 = [];
    const findAll = await models.Locations.findAll({
      where: {
        situation: "empty",
      },
    });
    findAll.map((x) => {
      const spilit = x.location.split(" ");
      console.log(x.location);
      Number1.push(spilit[1]);
      Number2.push(spilit[2]);
      Number3.push(spilit[3]);
      Number4.push(spilit[4]);
    });

    return {
      status: 200,
      message: {
        character,
        Number1,
        Number2,
        Number3,
        Number4,
      },
    };
  }

  // async orderPallet(request) {
  //   let stock=await models.StockItems.findAll({
  //     where:{driverName:request.driverName},
  //   });
  //   if(!stock){
  //     return{
  //       status:400,
  //       message:'driver not exist'
  //     }
  //   }
  //   let findArticle=await models.StockItems.findOne({
  //     where:{articleCode:stock.articleCode},
  //     include: [{ model: models.Locations, as: "locations" }],
  //   })
  //   let array = [];
  //   if (!findArticle) {
  //     return {
  //       status: 400,
  //       message: "pallet not exist",
  //     };
  //   }  if (( findArticle.locations.length === 0 )) {
  //     let orderPallet = await models.StockItems.findOne({
  //       where: {
  //         driverName: request.driverName,
  //       }
  //     });
  //     const orderBySituation = await this.orderBySituation(
  //       // orderPallet.pallet
  //      parseInt(orderPallet.pallet)
  //     );
  //     if (orderPallet.pallet == null) {
  //       return {
  //         status: 400,
  //         message: "pallet is null",
  //       };
  //     }
  //     for (let i = 0; i < orderPallet.pallet; i++) {
  //       array.push(orderPallet);
  //     }
  //     return {
  //       status: 201,
  //       message: {
  //         array:array,
  //         locations: orderBySituation.message,
  //       },
  //     };
  //   } else {
  //     if (findArticle.pallet == null) {
  //       return {
  //         status: 400,
  //         message: "pallet is null",
  //       };
  //     }
  //     const inert=await this.orderBySituations(
  //       parseInt(findArticle.pallet), findArticle.locations[0].location
  //     );

  //     for (let i = 0; i < findArticle.pallet; i++) {
  //       array.push(findArticle);
  //     };
  //     return{
  //       status:200,
  //       message:{
  //         array,
  //         locations:inert.message
  //        }} }
  //     }

  async orderPallet(request) {
    let Locations = [];
    let finnallresult = [];
    let lastLocation = [];
    let numberOfPallet = 0;
    let stockResult = [];
    let oo = [];
    let pp = [];
    var ok = [];
    let stock = await models.StockItems.findAll({
      where: { driverName: request.driverName },
    });
    if (!stock) {
      return {
        status: 400,
        message: "product with driver not exist",
      };
    } else {
      var result = 0;
      for (let i = 0; i < stock.length; i++) {
        let findArticle = await models.StockItems.findOne({
          where: { articleCode: stock[i].articleCode },
          include: [{ model: models.Locations,as:'locations' }],
        });
        findArticle;
        stockResult.push(findArticle);

        if (stock[i].pallet === null) {
        } else {
          result = parseInt(stock[i].pallet) + result;
        }
      }
      if (result === 0) {
        return {
          status: 400,
          message: "pallet is null",
        };
      } else {
        for (let i = 0; stockResult.length <= 0; i++) {
          if (stockResult[i].locations.length === 0) {
            for (let j = 0; j < stockResult.length; j++) {
              // lastLocation.push(await this.orderBySituation(result));
            }
          } else {
            for (let j = 0; j < stockResult.length; j++) {
              // Locations.push(
              //   await this.orderBySituations(
              //     result,
              //     stockResult.locations[0].location
              //   )
              // );
            }
          }
        }
        for (let i = 0; i < stockResult.length; i++) {
          if (stockResult[i].pallet === null) {
          } else {
            finnallresult[i] = stockResult[i].pallet;
          }
        }
        let NumberPallet = 0;
        for (let i = 0; i < stockResult.length; i++) {
          if (stockResult[i].pallet === null) {
          } else {
            for (let j = 0; j < stockResult[i].pallet; j++) {
              ok.push(stockResult[i], stockResult[i].pallet);
              numberOfPallet = stockResult[i].pallet + numberOfPallet;
              oo.push(stockResult[i]);
              if (stockResult[i].locations.length === 0) {
                // lastLocation.push(await this.orderBySituation(stockResult[i].pallet));
              } else {
                // Locations.push(await this.orderBySituations(stockResult[i].pallet,stockResult[i].locations.location))
              }
            }
            for (let z = 0; z < stockResult.length; z++) {
              if (stockResult[z].pallet === null) {
              } else {
                numberOfPallet = stockResult[z].pallet + numberOfPallet;
              }
            }
          }
        }
        //  console.log(ok.length);
        // for (let i = 0; i < ok.length -1; i+=2) {
        //   console.log(i);
        //     if (ok[i].locations.length === 0) {
        //       lastLocation.push(await this.orderBySituation(ok[i].pallet));
        //     } else {
        //       Locations.push(
        //         await this.orderBySituations(
        //           ok[i].pallet,
        //           ok[i].locations.location
        //         )
        //       );
        //     }

        // }
        console.log(ok);
        const loaction = await this.orderBySituation(result);
        return {
          status: 200,
          message: {
            ok,
            loaction,
          },
        };
      }
    }
  }
  async orderBySituations(pallet, request) {
    const limitNumber = Math.ceil(pallet / 2);
    const after = await models.Locations.findAll({
      order: [["location", "ASC"]],
      where: {
        location: {
          [Op.between]: [`${request}`, "T2337"],
        },
        situation: {
          [Op.eq]: "empty",
        },
        freeSituation: {
          [Op.eq]: "free",
        },
      },
      limit: limitNumber,
    });
    const before = await models.Locations.findAll({
      order: [["location", "DESC"]],
      where: {
        location: {
          [Op.between]: ["A0111", `${request}`],
        },
        situation: {
          [Op.eq]: "empty",
        },
        freeSituation: {
          [Op.eq]: "free",
        },
      },
      limit: limitNumber,
    });
    return {
      message: {
        after,
        before,
      },
    };
  }

  async call() {
    axios
      .post("https://nodejs.iran.liara.run/locations/orderpallet", {
        driverName: "محمد زینالی ",
      })
      .then((x) => {
        console.log(x.data);
      });
  }

  async clearLocation(request) {
    const [mi] = await models.Locations.update(request, {
      where: { situation: "fill" },
    });
    if (mi) {
      return {
        status: 200,
        message: "update",
      };
    } else {
      return {
        status: 400,
        message: "not update",
      };
    }
  }

  async fillLocationsAndSetEqualEmptyPallet(request) {
    const { articleCode, location,driverName } = request;
    const oldloaction=await models.Locations.findOne({
      where:{location:location}
     });
     if(oldloaction.situation=='fill'){
      return{
        status:400,
        message:'location is fill'
      }
     };
    const updateLocation = await models.Locations.update(
      {
        situation: "fill",
        code_id:articleCode
      },
      {
        where: { location: location },
      }
    );
    console.log(updateLocation);
    if (updateLocation.length === 0) {
      return {
        status: 400,
        message: "location not update",
      };
    } else {
      const updateStockItem = await models.StockItems.findOne({
        where:{articleCode:articleCode}
      });
     
      if(updateStockItem.length===0){
        return{
          status:200,
          message:'pallet deleted'
        }
        
        }else{
          console.log(updateStockItem.pallet);
          updateStockItem.pallet= parseInt(updateStockItem.pallet)-1;
           updateStockItem.save();

          const orderPallet=await this.orderPallet(request);
          console.log( parseInt(updateStockItem.pallet)-1);
          return{
            status:400,
            message:orderPallet
          }
        }
    }
  }

  async transferLocationForStockItemProduct(request){
   const {articleCode,oldlocation,newLocation}=request;

   const findStockItem=await models.StockItems.findOne({
    where:{articleCode:articleCode}
   });

   if(findStockItem){
   const findLocations=await models.Locations.findAll({
    where:{code_id:findStockItem.articleCode}
   });
    return await this.transferLocationForStockItemProductProcess(findLocations,oldlocation,newLocation,articleCode)
    
   }else{
    return{
      status:400,
      message:'not product'
    }
   }
  }

  async transferLocationForStockItemProductProcess(findedLocations,oldloaction,newLocation,articleCode){
   let insertLocationToArray=[];
   for(let i=0;i<findedLocations.length;i++){
     insertLocationToArray.push(findedLocations[i].location);
   } 
   for(let i=0;i<insertLocationToArray.length;i++){
    if(insertLocationToArray[i].loaction==oldloaction){
      selectedLocation=oldloaction
    }else{

    }
   };
   console.log(articleCode,newLocation);
   const updateLocation=await models.Locations.update({
    code_id:articleCode,
    situation:'fill'
   },
   {
    where:{location:newLocation}
   })

   const setEmptyToLocation=await models.Locations.update({
    situation:'empty',
    code_id:null
   },{
    where:{location:oldloaction}
   }).then(res=>{
    console.log(res);
   })
  const isNewLocationUpdated=[updateLocation];
  const isOldloactionUpdated=[setEmptyToLocation];
    if(isNewLocationUpdated===0){
      return {
        status:400,
        message:'location not updated'
      }
    }else if(isOldloactionUpdated===0){
      return{
        status:400,
        message:'location not update'
      }
    }else{
      return{
        status:200,
        message:'location update'
      }
    }
  }

};
