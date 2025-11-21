import dotenv from 'dotenv'
import express from "express";
import asyncHandler from "express-async-handler";

import AmigosReport from "../../services/reports/AmigosReport.js";
import AmigosReportExcel from "../../services/reports/AmigosReportExcel.js";


import PuestosReport from "../../services/reports/PuestosReport.js";
import PuestosReportExcel from "../../services/reports/PuestosReportExcel.js";


const amigosReport = async (req,res) =>{ 
    if (!req.query.limit) {
        throw "Se necesita el limite";
      }
    let dataresult = await AmigosReport.getList(req.query);    
    return res.status(dataresult.status).json(dataresult);   
}

const amigosReportExcel = async (req, res) => {
    console.log("amigosReportExcel")
    try {
        await AmigosReportExcel.getList(req.query, res);
    } catch (error) {
        res.status(500).json({ message: 'Error generando el reporte', error: error.message });
    }
};

////PUESTOS/////

const puestosReport = async (req,res) =>{ 
    if (!req.query.limit) {
        throw "Se necesita el limite";
      }
    let dataresult = await PuestosReport.getList(req.query);    
    return res.status(dataresult.status).json(dataresult);   
}

const puestosReportExcel = async (req, res) => {
    console.log("amigosReportExcel")
    try {
        await PuestosReportExcel.getList(req.query, res);
    } catch (error) {
        res.status(500).json({ message: 'Error generando el reporte', error: error.message });
    }
};




export default {
    amigosReport,
    amigosReportExcel,
    puestosReport,
    puestosReportExcel
}