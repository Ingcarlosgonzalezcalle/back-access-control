
import asyncHandler from "express-async-handler";
import service from "../../services/composter/operations/BalanceService.js";



const getController = asyncHandler(async (req, res) => {
  const body = req.query
  if (!body.storeId) {
    throw "Se necesita la bodega";
  }
  if (!body.productId) {
    throw "Se necesita el producto";
  }
  let dataresult = await service.get(body);
  return res.status(200).json(dataresult);
});


async function update(req, res) {
  const body = req.body
  if (!body.storeId) {
    throw "Se necesita la bodega";
  }
  if (!body.productId) {
    throw "Se necesita el producto";
  }
  let dataresult = await service.update(body);
  return res.status(dataresult.status).json(dataresult);
}

async function listController(req, res) {
  if (!req.query.limit) {
    throw "Se necesita el limite";
  }
  let dataresult = await service.getList(req.query);
  return res.status(dataresult.status).json(dataresult);
}


export default {
  listController,
  getController,
  update
}