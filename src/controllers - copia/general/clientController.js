import dotenv from 'dotenv'
import express from "express";
import asyncHandler from "express-async-handler";
import clientServices from "../../services/general/ClientServices.js";




async function insertClientController(req, res) {
    if (!req.body.identification) {
        throw "Se necesita el nit del cliente";
    }
    const body = req.body
    let dataresult = await clientServices.insertClient(body);
    return res.status(dataresult.status).json(dataresult);
}


async function updateClientController(req, res) {
    if (!req.params.id) {
        return res.status(500).json({ message: "se necesita el id del cliente" });
    }    
    const id = req.params.id;
    let dataresult = await clientServices.updateClient(id,req.body);
    return res.status(dataresult.status).json(dataresult);
}



async function enableClientController(req, res) {
    if (!req.params.id) {
        return res.status(500).json({ message: "se necesita el id del cliente" });
    }  
    const id = req.params.id;
    let dataresult = await clientServices.enableClient(id);
    return res.status(dataresult.status).json(dataresult);
}



async function disableClientController(req, res) {
    if (!req.params.id) {
        return res.status(500).json({ message: "se necesita el id del cliente" });
    }   
    const id = req.params.id;
    let dataresult = await clientServices.disableClient(id);
    return res.status(dataresult.status).json(dataresult);
}




async function listClientsController(req, res) {
    let dataresult = await clientServices.getList();
    return res.status(dataresult.status).json(dataresult.list);
}


async function getClientController(req, res) {
    if (!req.params.id) {
        throw "Se necesita el id del cliente";
    }
    const idClient = req.params.id;
    let dataresult = await clientServices.getClient(idClient);
    return res.status(dataresult.status).json(dataresult.client);
};




export default {
    listClientsController,
    insertClientController,
    updateClientController,
    getClientController,
    enableClientController,
    disableClientController
}