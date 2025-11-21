import dotenv from 'dotenv'
import express from "express";
import asyncHandler from "express-async-handler";

import dashboardServices from "../../services/general/DashboardServices.js";




async function insertDashboardController(req,res){    
    if (!req.body.name) {
        throw "Se necesita el nombre del dashboard";
      }
    const body = req.body
    let dataresult = await dashboardServices.insert(body); 
    return res.status(dataresult.status).json(dataresult); 
}

async function updateDashboardController(req,res){    
    if (!req.body.id) {
        return res.status(500).json({message:"se necesita el id del dashboard"}); 
      }
      const id = req.body.id;
      const name = req.body.name;
    let dataresult = await dashboardServices.update(id,name);    
    return res.status(dataresult.status).json(dataresult); 
}



async function listDashboardsController(req,res){ 
    let dataresult = await dashboardServices.getList();    
    return res.status(dataresult.status).json(dataresult.list);   
}



const getDashboardController = asyncHandler(async (req, res) => {
    if (!req.query.id) {
        throw "Se necesita el id del dashboard";
      }
    const idFind = req.query.id;
    let dataresult = await dashboardServices.get(idFind);    
    return res.status(200).json(dataresult);    
});



async function deleteDashboardController(req,res){     
    res.send("delete");
}



export default {
    listDashboardsController,
    insertDashboardController, 
    updateDashboardController,
    getDashboardController,
    deleteDashboardController
}