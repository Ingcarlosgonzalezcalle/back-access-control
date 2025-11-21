import ExcelJS from 'exceljs';
import { Op } from 'sequelize';
import Balance from '../../../models/balance.js';
import Store from '../../../models/store.js';
import Product from '../../../models/product.js';

const getExcel = async (req, res) => {
    const { type, product } = req.query;

    try {
        const match = {}
        if (product == 0 || product == null || product == undefined) {
            // match.days = { [Op.lt]: 80 } 
        }
        else { match.productId = { [Op.eq]: product } }

        const include = [
            { model: Store, attributes: ['name'] },
            { model: Product, attributes: ['name', 'type'] },
        ];

        if (type != 0 && type != null && type != undefined) {
            include[1].where = { type: { [Op.eq]: type } };
        }

        const balances = await Balance.findAll({
            where: match,
            include,
            attributes: ['balance'],
            raw: true,
        });

        // --- Convertir datos a formato pivot dinámico ---
        const pivot = {};
        const allProducts = new Set();

        balances.forEach((b) => {
            const store = b['store.name'];
            const product = b['product.name'];
            const balance = b.balance;

            if (!pivot[store]) pivot[store] = {};
            pivot[store][product] = (pivot[store][product] || 0) + Number(balance);
            allProducts.add(product);
        });

        // Convertir a array de objetos para Excel
        const columns = ['Bodega', ...Array.from(allProducts)];
        const rows = Object.entries(pivot).map(([store, products]) => {
            const row = { Bodega: store };
            allProducts.forEach((p) => (row[p] = products[p] || 0));
            return row;
        });

        // --- Calcular totales ---
        const totalRow = { Bodega: 'TOTAL' };
        allProducts.forEach((product) => {
            totalRow[product] = rows.reduce((sum, row) => sum + (row[product] || 0), 0);
        });
        rows.push(totalRow);

        // --- Crear Excel ---
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Saldos');

        worksheet.columns = columns.map((col) => ({
            header: col,
            key: col,
            width: 20,
        }));

        worksheet.addRows(rows);

        // Encabezado en negrita y centrado
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
        });

        // Estilo de la fila TOTAL
        const lastRow = worksheet.lastRow;
        lastRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFEFEFEF' },
            };
        });

        res.setHeader('Content-Disposition', 'attachment; filename="saldos.xlsx"');
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al generar el Excel:', error);
        res.status(500).send('Error al generar el archivo Excel');
    }
};

export default getExcel;
