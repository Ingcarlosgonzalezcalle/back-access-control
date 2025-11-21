

import Departamento from '../../models/departamento.js'
import Municipio from '../../models/municipio.js'
import Amigo from '../../models/amigo.js'
import Barrio from '../../models/barrio.js'
import { Op } from "sequelize";
import { 
  calcularEdad, 
  capitalizeWords, 
  corporacionName, 
  generoName, 
  tipoCandidatoName, 
  tipoName 
} from '../../utils/field-operations.js'

const getList = async (body) => {
  try {
    const { page = 1, limit = 10, tipo = 0, genero = 0, gremio = 0, candidato = 0, findName = "" } = body;


    const match = {}
    match.sincronizado = { [Op.eq]: 1 }
    if (findName != "") match.nombre = { [Op.like]: `%${findName}%` }
    if (tipo != 0) match.tipo = { [Op.eq]: tipo }
    if (genero != 0) match.genero = { [Op.eq]: genero }
    if (gremio != 0) match.gremio = { [Op.eq]: gremio }
    if (candidato != 0) match.candidato = { [Op.eq]: candidato }



    const offset = (page - 1) * limit;
    const result = await Amigo.findAndCountAll({
      where: match,
      include: [
        { model: Departamento, as: 'departamentos', attributes: ['nombre'] },
        { model: Municipio, as: 'municipios', attributes: ['nombre'] },
        { model: Barrio, as: 'barrios', attributes: ['nombre'] }
      ],
      attributes: [
        'id', 'nombre',
        'departamento_votacion', 'municipio_votacion', 'puesto_votacion', 'mesa_votacion', 'direccion_votacion',
        'cedula', 'celular', 'compromiso'],
      order: [['nombre', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    const list = result.rows


    const formattedReport = list.map(row => ({
      id: row.id,
      cedula: row.cedula,
      celular: row.celular,
      nombre: capitalizeWords(row.nombre),
      departamento_votacion: capitalizeWords(row.departamento_votacion),
      municipio_votacion: capitalizeWords(row.municipio_votacion),
      puesto_votacion: capitalizeWords(row.puesto_votacion),
      mesa_votacion: row.mesa_votacion,
      direccion_votacion: capitalizeWords(row.direccion_votacion)
    }));



    const totalPages = Math.ceil(result.count / limit)
    return { success: true, message: "success", status: 200, data: formattedReport, total: result.count, page: page, totalPages, error: null };
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
};





export default {
  getList
};