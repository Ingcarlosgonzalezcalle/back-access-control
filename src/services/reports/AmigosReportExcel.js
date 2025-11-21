

import Departamento from '../../models/departamento.js'
import Municipio from '../../models/municipio.js'
import Amigo from '../../models/amigo.js'
import Barrio from '../../models/barrio.js'
import Gremio from '../../models/gremio.js'
import { Op } from "sequelize";
import ExcelJS from 'exceljs';
import { 
  calcularEdad, 
  capitalizeWords, 
  corporacionName, 
  generoName, 
  tipoCandidatoName, 
  tipoName 
} from '../../utils/field-operations.js'

const getList = async (body, res) => {
  try {
    const { tipo = 0, genero = 0, gremio = 0, candidato = 0, findName = "" } = body;

    const match = {}

    if (findName != "") match.nombre = { [Op.like]: `%${findName}%` }
    if (tipo != 0) match.tipo = { [Op.eq]: tipo }
    if (genero != 0) match.genero = { [Op.eq]: genero }
    if (gremio != 0) match.gremio = { [Op.eq]: gremio }
    if (candidato != 0) match.candidato = { [Op.eq]: candidato }

    const report = await Amigo.findAll({
      where: match,
      include: [
        { model: Departamento, as: 'departamentos', attributes: ['nombre'] },
        { model: Municipio, as: 'municipios', attributes: ['nombre'] },
        { model: Barrio, as: 'barrios', attributes: ['nombre'] },
        { model: Gremio, as: 'gremios', attributes: ['nombre'] }
      ],
      attributes: [
        'id', 'nombre', 'cedula', 'celular', 'compromiso', 'direccion',
        'votos', 'profesion', 'entidad','genero','tipo','candidato',
        'corporacion','fecha_nacimiento','email'
      ], 
      order: [['nombre', 'ASC']]
    });



    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Movements');

       const formattedReport = report.map(row => ({
            id: row.id,
            cedula: row.cedula,
            nombre: row.nombre,
            genero: generoName(row.genero),
            celular: row.celular,
            departamento: row.departamentos?.nombre,
            municipio: row.municipios?.nombre,
            direccion: row.direccion,
            tipo: tipoName(row.tipo),
            candidato: tipoCandidatoName(row.candidato),
            corporacion: corporacionName(row.corporacion),
            votos: row.votos,
            compromiso: row.compromiso,
            fecha_nacimiento: row.fecha_nacimiento,
            edad: calcularEdad(row.fecha_nacimiento),            
            gremio: row.gremios?.nombre,         
            profesion: row.profesion,         
            entidad: row.entidad,       
            email: row.email,
        }));


    worksheet.columns = [
      { header: 'Cedula', key: 'cedula', width: 12 },
      { header: 'Nombre', key: 'nombre', width: 45 },
      { header: 'Genero', key: 'genero', width: 10 },
      { header: 'Celular', key: 'celular', width: 15 },
      { header: 'Departamento', key: 'departamento', width: 15 },
      { header: 'Municipio', key: 'municipio', width: 15 },
      { header: 'Direccion', key: 'direccion', width: 30 },
      { header: 'Tipo', key: 'tipo', width: 8 },
      { header: 'Candidato', key: 'candidato', width: 16 },
      { header: 'Corporacion', key: 'corporacion', width: 8 },
      { header: 'Votos', key: 'votos', width: 8 },
      { header: 'Compromiso', key: 'compromiso', width: 12 },
      { header: 'F nacimiento', key: 'fecha_nacimiento', width: 14 },
      { header: 'Edad', key: 'edad', width: 8 },
      { header: 'Gremio', key: 'gremio', width: 11 },
      { header: 'profesion', key: 'profesion', width: 15 },
      { header: 'entidad', key: 'entidad', width: 15 },
      { header: 'email', key: 'email', width: 22 }
    ];

    worksheet.addRows(formattedReport);
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
    });
    
    res.setHeader('Content-Disposition', 'attachment; filename="report.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    await workbook.xlsx.write(res);
    res.end();


  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
};




export default {
  getList
};