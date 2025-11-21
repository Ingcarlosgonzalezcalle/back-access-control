import dotenv from 'dotenv'
import express from "express";
import asyncHandler from "express-async-handler";

import getDataLiquidation from "../../services/liquidations/getDataLiquidations.js";
import createLiquidation from "../../services/liquidations/createLiquidation.js";
import verifyLiquidationDate from "../../services/liquidations/verifyLiquidationDate.js";
import liquidationList from "../../services/liquidations/LiquidationList.js";
import deleteLiquidation from "../../services/liquidations/deleteLiquidation.js";
import lastLiquidationDate from "../../services/liquidations/getLastLiquidationDate.js";




async function insert(req, res) {  
  const body = req.body   
  if (!body.date) {
    throw "Se necesita la fecha";
  }
  let dataresult = await createLiquidation(body);
  return res.status(dataresult.status).json(dataresult);
}



const dataLiquidation = asyncHandler(async (req, res) => {
  if (!req.query.date) {
    throw "Se necesita la fecha";
  }
  const date = req.query.date;
  let dataresult = await getDataLiquidation(date);
  return res.status(200).json(dataresult);
});

const getVerifyLiquidationDate = asyncHandler(async (req, res) => {
  if (!req.query.date) {
    throw "Se necesita la fecha";
  }
  const date = req.query.date;
  let dataresult = await verifyLiquidationDate(date);
  return res.status(200).json(dataresult);
});


async function getLiquidationList(req,res){ 
    if (!req.query.limit) {
        throw "Se necesita el limite";
      }
    let dataresult = await liquidationList(req.query);    
    return res.status(dataresult.status).json(dataresult);   
}




async function deleteLiquidationDate(req, res) {  
  const body = req.body   
  if (!body.date) {
    throw "Se necesita la fecha";
  }
  let dataresult = await deleteLiquidation(body);
  return res.status(dataresult.status).json(dataresult);
}


const getLastLiquidationDate = asyncHandler(async (req, res) => {
  let dataresult = await lastLiquidationDate();
  return res.status(200).json(dataresult);
});


export default {
  insert,
  dataLiquidation,
  getVerifyLiquidationDate,
  getLiquidationList,
  deleteLiquidationDate,
  getLastLiquidationDate
}