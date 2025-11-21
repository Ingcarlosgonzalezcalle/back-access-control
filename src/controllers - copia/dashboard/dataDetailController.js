import dotenv from 'dotenv'
import express from "express";
import asyncHandler from "express-async-handler";

import dataDetailService from "../../services/general/DataDetailService.js";


async function dataDetailsByDataController(req, res) {
    console.log(req.params.id)
    console.log(req.query.company)
    if (!req.params.id) {
        return res.status(400).json({ message: "se necesita el id de la data" });
    }  
    if (!req.query.company) {
        return res.status(400).json({ message: "se necesita la comañia" });
    }   
    let dataresult = await dataDetailService.dataDetailsByData(req.params.id,req.query.company);
    return res.status(dataresult.status).json(dataresult.list);
}




async function listByClient(req, res) {

    console.log(req.query)

    if (!req.params.id) {
        return res.status(400).json({ message: "se necesita el id del cliente" });
    }  
    if (!req.query.option) {
        return res.status(400).json({ message: "se necesita el option" });
    } 
    if (!req.query.company) {
        return res.status(400).json({ message: "se necesita la compañia" });
    }   
    let clientId = req.params.id;
    let option = req.query.option;
    let company = req.query.company;
    let dataresult = await dataDetailService.getDataDetailsByClient(clientId,option,company);
    return res.status(dataresult.status).json(dataresult.list);
}


export default {
    dataDetailsByDataController,
    listByClient
}