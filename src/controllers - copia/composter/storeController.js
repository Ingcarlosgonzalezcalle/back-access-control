import dotenv from 'dotenv'
import express from "express";
import asyncHandler from "express-async-handler";

import service from "../../services/composter/params/StoreService.js";

async function getAllList(req,res){ 
  let dataresult = await service.getAllList();    
  return res.status(dataresult.status).json(dataresult.data);   
}

async function update(req,res){    
    if (!req.body.name) {
        throw "Se necesita el nombre";
      }
    const body = req.body
    let dataresult = await service.update(body); 
    return res.status(dataresult.status).json(dataresult); 
}




async function insertController(req,res){    
    if (!req.body.name) {
        throw "Se necesita el nombre";
      }
    const body = req.body
    let dataresult = await service.insert(body); 
    return res.status(dataresult.status).json(dataresult); 
}


async function listController(req,res){ 
    if (!req.query.limit) {
        throw "Se necesita el limite";
      }
    let dataresult = await service.getList(req.query);    
    return res.status(dataresult.status).json(dataresult);   
}


async function productiveStores(req,res){ 
    let dataresult = await service.getProductiveStores(req.query);    
    return res.status(dataresult.status).json(dataresult);   
}



const getController = asyncHandler(async (req, res) => {
    if (!req.query.id) {
        throw "Se necesita el id";
      }
    const idFind = req.query.id;
    let dataresult = await service.get(idFind);    
    return res.status(200).json(dataresult);    
});



async function deleteController(req,res){     
    res.send("delete");
}




async function storeWithInventory(req,res){ 
    let dataresult = await service.getStoreWithInventory(req.query);    
    return res.status(dataresult.status).json(dataresult);   
}


async function getTransferList(req,res){ 
  let dataresult = await service.getTransferList();    
  return res.status(dataresult.status).json(dataresult.data);   
}


async function getActiveList(req,res){ 
  let dataresult = await service.getActiveList();    
  return res.status(dataresult.status).json(dataresult.data);   
}


export default {
  productiveStores,
    listController,
    insertController, 
    getController,
    deleteController,
    update,
    getAllList,
    storeWithInventory,
    getTransferList,
    getActiveList
}