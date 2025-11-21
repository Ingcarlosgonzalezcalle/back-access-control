import dotenv from 'dotenv'
import express from "express";
import asyncHandler from "express-async-handler";

import service from "../../services/params/UserService.js";



async function insert(req,res){  
  
    if (!req.body.username) { 
      throw "Se necesita el username"; 
    }
    if (!req.body.password) { 
      throw "Se necesita el password"; 
    }
    const body = req.body
    let dataresult = await service.insert(body); 
    return res.status(dataresult.status).json(dataresult); 
}

async function login(req,res){    
    if (!req.body.username) { 
      console.log("no trae el username")
      throw "Se necesita el username"; 
    }
    if (!req.body.password) { 
      console.log("no trae el password")
      throw "Se necesita el password"; 
    }
    const body = req.body
    let dataresult = await service.login(body); 
    return res.status(dataresult.status).json(dataresult); 
}

async function list(req,res){ 
    if (!req.query.limit) {
        throw "Se necesita el limite";
      }
    let dataresult = await service.getList(req.query);    
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


async function update(req,res){    
  
  console.log(req.body)

    if (!req.body.username) {
        throw "Se necesita el username";
      }
    const body = req.body
    let dataresult = await service.update(body); 
    return res.status(dataresult.status).json(dataresult); 
}


/*







async function deleteRecord(req,res){     
    res.send("delete");
}

*/


export default {
    insert,
    login,
    list,
    get,
    update
}