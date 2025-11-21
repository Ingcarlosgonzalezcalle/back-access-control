

import Departamento from '../../models/departamento.js'
import Municipio from '../../models/municipio.js'
import Amigo from '../../models/amigo.js'
import Barrio from '../../models/barrio.js'
import Gremio from '../../models/gremio.js'
import { Op, literal } from "sequelize";
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

    console.log("findName:::", findName)
    if (findName != "") {
      console.log("entro")
    }
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
        { model: Barrio, as: 'barrios', attributes: ['nombre'] },
        { model: Gremio, as: 'gremios', attributes: ['nombre'] },
        { model: Amigo, as: 'lider_data', attributes: ['id', 'nombre'] }
      ],
      attributes: [
        [
          literal(`IFNULL((SELECT SUM(am.compromiso) 
                   FROM amigos am 
                   WHERE am.lider = amigos.id), 0)`),
          'compromiso_hijos'
        ],
        [
          literal(`IFNULL((SELECT COUNT(am2.id) 
                   FROM amigos am2 
                   WHERE am2.lider = amigos.id), 0)`),
          'contador_hijos'
        ],
        'id', 'nombre', 'cedula', 'celular', 'compromiso', 'direccion',
        'votos', 'profesion', 'entidad', 'genero', 'tipo', 'candidato',
        'corporacion', 'fecha_nacimiento', 'email', 'foto',
         'twitter', 'facebook', 'instagram',
        'departamento_votacion', 'municipio_votacion', 'puesto_votacion', 'mesa_votacion', 'direccion_votacion',],
      order: [['nombre', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });


    const list = result.rows.map(row => ({
      id: row.id,
      cedula: row.cedula,
      nombre: capitalizeWords(row.nombre),
      genero: generoName(row.genero),
      celular: row.celular,
      departamento: row.departamentos?.nombre,
      municipio: row.municipios?.nombre,
      barrio: row.barrios?.nombre,
      direccion: capitalizeWords(row.direccion),
      tipo: tipoName(row.tipo),
      candidato: tipoCandidatoName(row.candidato),
      corporacion: corporacionName(row.corporacion),
      votos: row.votos,
      compromiso: row.compromiso,
      compromiso_hijos: row.get("compromiso_hijos"),
      contador_hijos: row.get("contador_hijos"),
      fecha_nacimiento: row.fecha_nacimiento,
      edad: calcularEdad(row.fecha_nacimiento),
      gremio: row.gremios?.nombre,
      profesion: capitalizeWords(row.profesion),
      entidad: capitalizeWords(row.entidad),
      email: row.email,
      foto: row.foto,
      departamento_votacion: capitalizeWords(row.departamento_votacion),
      municipio_votacion: capitalizeWords(row.municipio_votacion),
      puesto_votacion: capitalizeWords(row.puesto_votacion),
      mesa_votacion: row.mesa_votacion,
      direccion_votacion: capitalizeWords(row.direccion_votacion),
      lider: capitalizeWords(row.lider_data?.nombre || ""),
      twitter: row.twitter,
      facebook: row.facebook,
      instagram: row.instagram
    }));

    console.log(list)


    const totalPages = Math.ceil(result.count / limit)
    return { success: true, message: "success", status: 200, data: list, total: result.count, page: page, totalPages, error: null };
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
};








export default {
  getList
};