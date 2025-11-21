import dotenv from 'dotenv'
import express from "express";
import asyncHandler from "express-async-handler";

import service from "../../services/composter/params/MachineService.js";



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


const activeList = asyncHandler(async (req, res) => {
    let dataresult = await service.getActiveList();    
    return res.status(200).json(dataresult.data);    
});




export default {
    listController,
    insertController, 
    getController,
    deleteController,
    update,
    activeList
}