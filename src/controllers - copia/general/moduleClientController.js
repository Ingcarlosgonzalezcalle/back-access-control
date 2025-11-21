import dotenv from 'dotenv'
import express from "express";
import asyncHandler from "express-async-handler";

import service from "../../services/general/ModuleClientService.js";




async function insertController(req, res) {
    if (!req.body.clientId) {
        return res.status(500).json({ menssage: "se necesita el cliente" });
    }
    if (!req.body.moduleId) {
        return res.status(500).json({ menssage: "se necesita el modulo" });
    }
    const body = req.body
    let dataresult = await service.insert(body);
    return res.status(dataresult.status).json(dataresult);
}


async function listController(req, res) {
    let dataresult = await service.getList();
    return res.status(dataresult.status).json(dataresult.list);
}



const getController = asyncHandler(async (req, res) => {
    if (!req.query.id) {
        throw "Se necesita el id del detail";
    }
    const idFind = req.query.id;
    let dataresult = await service.get(idFind);
    return res.status(200).json(dataresult);
});


const getModulesByClientController = asyncHandler(async (req, res) => {
    if (!req.query.id) {
        throw "Se necesita el id del cliente";
    }
    const id = req.query.id;
    let dataresult = await service.getModulesByClient(id);
    return res.status(200).json(dataresult);
});


const getModulesActiveByClientController = asyncHandler(async (req, res) => {
    if (!req.query.id) {
        throw "Se necesita el id del cliente";
    }
    const id = req.query.id;
    let dataresult = await service.getModulesActiveByClient(id);
    return res.status(200).json(dataresult);
});



async function deleteController(req, res) {
    if (!req.body.clientId) {
        return res.status(500).json({ menssage: "se necesita el cliente" });
    }
    if (!req.body.moduleId) {
        return res.status(500).json({ menssage: "se necesita el modulo" });
    }
    const body = req.body
    let dataresult = await service.deleteReg(body);
    return res.status(dataresult.status).json(dataresult);
}


export default {
    listController,
    insertController,
    getController,
    getModulesByClientController,
    getModulesActiveByClientController,
    deleteController
}