import dotenv from 'dotenv'
import express from "express";
import asyncHandler from "express-async-handler";

import service from "../../services/general/DataService.js";




async function insertController(req,res){    
    if (!req.body.name) {
        throw "Se necesita el nombre del detail";
      }
    const body = req.body
    let dataresult = await service.insert(body); 
    return res.status(dataresult.status).json(dataresult); 
}


async function listController(req,res){ 
    let dataresult = await service.getList();    
    return res.status(dataresult.status).json(dataresult.list);   
}

async function listByClientController(req,res){ 
    if (!req.params.id) {
        throw "Se necesita el id del cliente";
    }
    let dataresult = await service.getListByClient(req.params.id);    
    return res.status(dataresult.status).json(dataresult.list);   
}



const getController = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        throw "Se necesita el id del detail";
      }
    const idFind = req.params.id;
    let dataresult = await service.get(idFind);    
    return res.status(200).json(dataresult);    
});



async function deleteController(req,res){     
    res.send("delete");
}



export default {
    listController,
    insertController, 
    getController,
    deleteController,
    listByClientController
}