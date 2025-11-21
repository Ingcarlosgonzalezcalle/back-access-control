
import DataDetail from '../../models/dataDetail.js'
import Data from '../../models/data.js'
import { Op } from "sequelize";
import  moment  from "moment";
import { Sequelize } from 'sequelize';



///se debe llamar algo así como dashboar cliente. compuesto por todos los dada del cliente y sus series
const getDataDetailsByClient = async (clientId, option, company) => {
  try {
    const list = await Data.findAll({
      where: { clientId },
      attributes: ['id', 'name']
    });
    const arreglo = []
    for (const item of list) {
      let data = await getListData(item.id, option, company)
      arreglo.push({ title: item.name, data });
    }
    return { list: arreglo, status: 200 };
  } catch (err) {
    return { list: null, status: 500, error: err };
  }
}





///ESTE NO INTERESA ACTUALMENTE
const dataDetailsByData = async (dataId,company) => {
  console.log("solocita el dataId:", dataId)
  const data = await Data.findOne({ where: { id: dataId } });
  let products = data.product;
  const list = products.split(',');
  const arreglo = []
  for (const item of list) {
    let dataDetails = await getDataDetailsByDataByYear(dataId, item,company)
    arreglo.push({ title: item, data: dataDetails });
  }
  return { list: arreglo, status: 200 };
}







///METODO LOCAL QUE SIRVE PARA TRAER LOS DIFERENTES DATA Y OBTENER SU DATADETAIL
const getListData = async (dataId, option, company) => {
  console.log("solocita el dataId:", dataId)
  const data = await Data.findOne({ where: { id: dataId } });
  let products = data.product;
  const list = products.split(',');
  const arreglo = []
  for (const item of list) {
    console.log("company::::" + company)
    if (option == "YEAR") {
      let dataDetails = await getDataDetailsByDataByYear(dataId, item,company)
      arreglo.push({ title: item, data: dataDetails });
    }
    else if (option == "MONTH") {
      let dataDetails = await getDataDetailsByDataByMonth(dataId, item,company)
      arreglo.push({ title: item, data: dataDetails });
    }
    else {
      let dataDetails = await getDataDetailsByData(dataId, item,company)
      arreglo.push({ title: item, data: dataDetails });
    }

  }
  return arreglo;
}


///METODO LOCAL QUE RETORNA EL DATADETAIL POR CADA DATA POR DIA
const getDataDetailsByData = async (dataId, product, company) => {

  console.log("revisa el ultimo registro")
  const fechaUltimoRegistro = await getFechaUltimoRegistro();
  
  console.log("el ultimo registro:"+fechaUltimoRegistro)



  if (!fechaUltimoRegistro) {
    console.log('No se encontró ningún registro.');
    return;
  }

  const treintaDiasAtras = moment(fechaUltimoRegistro).subtract(30, 'days').toDate();  

  console.log(treintaDiasAtras)
  
  console.log("ENTRO POR EL DIARIO:"+company)
  try {
    const list = await DataDetail.findAll({
      attributes: [
        ['xValue', 'time'],
        ['yValue', 'value']
      ],
      where: { dataId, company, name: product,xValue: { [Op.between]: [treintaDiasAtras, fechaUltimoRegistro] } },
      order: [['xValue', 'ASC']]
    }
    );
    return list;
  } catch (err) {
    console.log(err)
    return null;
  }
}


///METODO LOCAL QUE RETORNA EL DATADETAIL POR CADA DATA BY YEAR
const getDataDetailsByDataByYear = async (dataId, product, company) => {
  // Atributo para mostrar el año: [Sequelize.fn('YEAR', Sequelize.col('xValue')), 'year'],  
  try {
    const list = await DataDetail.findAll({
      attributes: [
          [Sequelize.literal("STR_TO_DATE(CONCAT(YEAR(xValue), '-01-01'), '%Y-%m-%d')"), 'time'],
          [Sequelize.fn('SUM', Sequelize.col('yValue')), 'value'],
      ],
      where: { dataId, name: product, company},
      group: [
          Sequelize.fn('YEAR', Sequelize.col('xValue')),
          Sequelize.literal("STR_TO_DATE(CONCAT(YEAR(xValue), '-01-01'), '%Y-%m-%d')")
      ],
      order: [['time', 'ASC']],
      raw: true,
  });

    return list;
  } catch (err) {
    console.log("ERROR:::",err)
    return null;
  }
}




///METODO LOCAL QUE RETORNA EL DATADETAIL POR CADA DATA POR MES
const getDataDetailsByDataByMonth = async (dataId, product, company) => {

  const fechaUltimoRegistro = await getFechaUltimoRegistro();

  if (!fechaUltimoRegistro) {
    console.log('No se encontró ningún registro.');
    return;
  }

  const unAnioAtras = moment(fechaUltimoRegistro).subtract(1, 'year').toDate();  
  

  try {
    const list = await DataDetail.findAll({
      attributes: [
          [Sequelize.literal("STR_TO_DATE(CONCAT(YEAR(xValue), '-', LPAD(MONTH(xValue), 2, '0'), '-01'), '%Y-%m-%d')"), 'time'],
          [Sequelize.fn('SUM', Sequelize.col('yValue')), 'value'],
      ],
      where: { dataId, company, name: product,xValue: { [Op.between]: [unAnioAtras, fechaUltimoRegistro] } },
      group: [
          Sequelize.fn('YEAR', Sequelize.col('xValue')),
          Sequelize.fn('MONTH', Sequelize.col('xValue')),
          Sequelize.literal("STR_TO_DATE(CONCAT(YEAR(xValue), '-', LPAD(MONTH(xValue), 2, '0'), '-01'), '%Y-%m-%d')")
      ],
      order: [['time', 'ASC']],
      raw: true,
  });
    return list;
  } catch (err) {
    console.log("Existio un error:", err)
    return null;
  }
}


async function getFechaUltimoRegistro() {
  try {
    const ultimoRegistro = await DataDetail.findOne({
      attributes: ['xValue'],
      order: [['xValue', 'DESC']]
    });

    console.log("ultimo registro:"+ultimoRegistro)

    return ultimoRegistro ? ultimoRegistro.xValue : null;
  } catch (error) {
    console.error('Error al obtener la fecha del último registro:', error);
    return null;
  }
}



export default {
  dataDetailsByData,
  getDataDetailsByClient
};