import ExcelJS from 'exceljs';
import xlsx from "xlsx";
import fs from "fs";
import { Op } from "sequelize";

import MovementDetail from '../../../models/movementDetail.js'
import Movement from '../../../models/movement.js'
import Store from '../../../models/store.js'
import Activity from '../../../models/operationType.js'
import Product from '../../../models/product.js'
import OperationType from '../../../models/operationType.js'




// Función principal para realizar la consulta y generar el Excel

const getExcelMovementDetails = async (req, res) => {
    const {startDate, endDate} = req.query
    console.log("entro a generar el excel")
    try {




        const report = await MovementDetail.findAll({            
            attributes: ['description', 'machineName', 'time'],
            include: [
                {
                  model: Movement,
                  attributes: ['date', 'quantity', 'description',  'ticket'],
                  where: {
                    date: {
                      [Op.between]: [startDate+" 00:00:00", endDate+" 23:59:59"] 
                    }
                  },
                  include: [
                    {
                      model: Store,
                      as: 'store',
                      attributes: ['name']
                    },
                    {
                      model: OperationType,
                      attributes: ['name']
                    }      
                  ]
                }   
              ],   
           
        });


        
        const formattedReport = report.map(row => ({
            date: row.movement.date,
            store: row.movement.store.name,
            operationType: row.movement.operation_type?.name || 'NAh',
            product: row.movement.productName || 'NA', // Acceder a product.name
            machineName: row.machineName,
            time: row.time,
            ticket: row.movement.ticket || 'N/A',
            description_movement: row.movement.description || 'N/A',
            description_activity: row.description || 'N/A',
            quantity: row.movement.quantity || 'N/A',
        }));


        // Crear un nuevo workbook y una hoja
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Movements');

        worksheet.columns = [
            { header: 'Fecha', key: 'date', width: 12 },
            { header: 'Bodega', key: 'store', width: 18 },
            { header: 'Operación', key: 'operationType', width: 15 },
            { header: 'Producto', key: 'product', width: 15 },
            { header: 'Recurso', key: 'machineName', width: 15 },
            { header: 'Tiempo (min)', key: 'time', width: 13 },
            { header: 'Tiquete', key: 'ticket', width: 13 },
            { header: 'Cantidad', key: 'quantity', width: 13 },
            { header: 'Descripcion movimiento', key: 'description_movement', width: 50 },
            { header: 'Descripcion actividad', key: 'description_activity', width: 50 },
        ];

        // Agregar datos a la hoja
        worksheet.addRows(formattedReport);

        // Aplicar estilos a los encabezados
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
        });

        // Configurar la respuesta HTTP para la descarga con `stream`
        res.setHeader('Content-Disposition', 'attachment; filename="report.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Enviar el archivo al cliente usando stream
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Error al generar el Excel:", error);
        res.status(500).send("Error al generar el archivo Excel");
    }
}


export default getExcelMovementDetails;
