import dotenv from 'dotenv'
import express from "express";
import asyncHandler from "express-async-handler";

import service from "../../services/params/PersonService.js";


async function update(req,res){    
    if (!req.body.name) {
        throw "Se necesita el name";
      }
    const body = req.body
    let dataresult = await service.update(body); 
    return res.status(dataresult.status).json(dataresult); 
}


async function insert(req,res){    
    if (!req.body.name) {
        throw "Se necesita el name";
      }
    const body = req.body
    let dataresult = await service.insert(body); 
    return res.status(dataresult.status).json(dataresult); 
}


async function list(req,res){ 
    if (!req.query.limit) {
        throw "Se necesita el limite";
      }
    let dataresult = await service.getList(req.query);    
    return res.status(dataresult.status).json(dataresult);   
}



async function listAll(req,res){ 
    let dataresult = await service.getListAll(req.query);    
    return res.status(dataresult.status).json(dataresult);   
}



const get = asyncHandler(async (req, res) => {
    if (!req.query.id) {
        throw "Se necesita el id";
      }
    const idFind = req.query.id;
    let dataresult = await service.get(idFind);    
    return res.status(200).json(dataresult);    
});



async function deleteRecord(req,res){     
    res.send("delete");
}




export default {
    list,
    insert,
    update,
    deleteRecord,
    get,
    listAll
}