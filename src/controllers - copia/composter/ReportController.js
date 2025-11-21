import dotenv from 'dotenv'
import express from "express";
import asyncHandler from "express-async-handler";


///movements
import getReportMovements from '../../services/composter/reports/ReportMovements.js';
import getExcelMovements from '../../services/composter/reports/ExcelMovements.js';
import getReportProduct from '../../services/composter/reports/ReportProductInventory.js';
import getExcelProductInventory from '../../services/composter/reports/ExcelProductInInventory.js';

///movementdetails
import getReportMovementDetails from '../../services/composter/reports/ReportMovementDetails.js';
import getExcelMovementDetails from '../../services/composter/reports/ExcelMovementDetails.js';






import getMonthlyReport from '../../services/composter/MonthlyReport.js';
import getExcelMonthlyReport from '../../services/composter/ExcelMonthlyReport.js';



const excelMovementDetails = async (req, res) => {
    try {
        await getExcelMovementDetails(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error generando el reporte', error: error.message });
    }
};


const excelMovements = async (req, res) => {
    try {
        await getExcelMovements(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error generando el reporte', error: error.message });
    }
};




const reportMovements = asyncHandler(async (req, res) => {
    let dataresult = await getReportMovements(req.query);
    return res.status(200).json(dataresult);
});



const reportMovementDetails = asyncHandler(async (req, res) => {
    let dataresult = await getReportMovementDetails(req.query);
    return res.status(200).json(dataresult);
});





const reportProductInventory = asyncHandler(async (req, res) => {
    let dataresult = await getReportProduct(req.query);
    return res.status(200).json(dataresult);
});



const excelProductInventory = async (req, res) => {
    try {
        await getExcelProductInventory(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error generando el reporte', error: error.message });
    }
};



const monthlyReport = asyncHandler(async (req, res) => {
    let dataresult = await getMonthlyReport(req.query);
    return res.status(200).json(dataresult);
});


const excelMonthlyReport = async (req, res) => {
    try {
        await getExcelMonthlyReport(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error generando el reporte', error: error.message });
    }
};





export default {
    reportMovements,
    reportMovementDetails,
    excelMovements,
    excelMovementDetails,
    reportProductInventory,
    excelProductInventory,
    monthlyReport,
    excelMonthlyReport
}