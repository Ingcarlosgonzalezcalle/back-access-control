import ExcelJS from 'exceljs';
import { Op } from 'sequelize';

import Movement from '../../../models/movement.js'
import Store from '../../../models/store.js'
import Activity from '../../../models/operationType.js'




// Función principal para realizar la consulta y generar el Excel

const getExcelMovements = async (req, res) => {
    const { startDate, endDate } = req.query

    console.log("entro a generar el excel")

    try {





        // Obtener datos desde la BD
        const report = await Movement.findAll({
            where: { date: { [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"] } },
            include: [
                {
                    model: Activity,
                    attributes: ['name']
                },
                {
                    model: Store,
                    as: 'store',   // relación principal
                    attributes: ['name']
                }
            ],
            attributes: ['id', 'quantity', 'date', 'cycles', 'bags', 'presentation', 'productName',  'storeName', 'origin',  'destination', 'productName', 'description', 'finished'],
            order: [['createdAt', 'DESC']]
        });



        console.log(report)


        const formattedReport = report.map(row => ({
            id: row.id,
            quantity: row.quantity,
            date: row.date,
            bags: row.bags,
            cycles: row.cycles,
            presentation: presentationName(row.presentation),
            ticket: row.ticket || 'NA',
            description: row.description || 'NA',
            product: row.productName || 'NA', // Acceder a product.name
            operationType: row.operation_type?.name || 'NA',
            store: row.storeName || 'NA',
            origin: row.origin || 'NA',
            destination: row.destination|| 'NA',
            finished: row.finished
        }));


        // Crear un nuevo workbook y una hoja
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Movements');

        worksheet.columns = [
            { header: 'Fecha', key: 'date', width: 12 },
            { header: 'Bodega', key: 'store', width: 15 },
            { header: 'Origen', key: 'origin', width: 15 },
            { header: 'destino', key: 'destination', width: 15 },
            { header: 'Tipo de Movimiento', key: 'operationType', width: 20 },
            { header: 'Cantidad', key: 'quantity', width: 15 },
            { header: 'Producto', key: 'product', width: 15 },
            { header: 'Tiquete', key: 'ticket', width: 15 },
            { header: 'Presentacion', key: 'presentation', width: 15 },
            { header: 'Sacos', key: 'bags', width: 7 },
            { header: 'Ciclos', key: 'cycles', width: 7 },
            { header: 'Descripcion', key: 'description', width: 70 },
            { header: 'Finalizado', key: 'finished', width: 15 },
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


const presentationName = (code) => {
    console.log(code)
    if (code == 1) {
        return "Granel"
    }
    else if (code == 2) {
        return "Empacado"
    }
    else {
        return "NA"
    }

}


export default getExcelMovements;
