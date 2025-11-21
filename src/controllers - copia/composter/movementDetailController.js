import dotenv from 'dotenv'
import express from "express";
import asyncHandler from "express-async-handler";

import service from "../../services/composter/MovementDetailService.js";




async function insertController(req,res){    
    if (!req.body.movementId) {
        res.status(403).json("se necesita el movimiento"); 
      }
    const body = req.body
    let dataresult = await service.insert(body); 
    return res.status(dataresult.status).json(dataresult); 
}


async function listController(req,res){ 
    let dataresult = await service.getList();    
    return res.status(dataresult.status).json(dataresult.list);   
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





export default {
    listController,
    insertController, 
    getController,
    deleteController
}