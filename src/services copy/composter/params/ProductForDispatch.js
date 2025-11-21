


import { Op } from "sequelize";
import Balance from '../../../models/balance.js'
import Store from '../../../models/store.js'
import Product from '../../../models/product.js'


const ProductForDispatch = async (body) => {

  //el tipo 3 hace referencia a producto terminado
  const  type =3
 

  try {

    const match = { balance: { [Op.gt]: 0 } }
    //const match = {}
   
    const include = [
      {
        model: Store,
        attributes: ['id','name']
      },
      {
        model: Product,
        attributes: ['id','name', 'type'],
      }
    ];

    if (type != 0 && type != null && type != undefined) {
      include[1].where = { type: { [Op.eq]: type } };
    }

    const report = await Balance.findAll({
      where: match,
      include,
      attributes: ['id','balance'],
      order: [[Store, 'id', 'ASC']],
    });

     const formattedReport = report.map(row => ({
            balanceId: row.id,
            balance: row.balance,
            storeName: row.store?.name||'0',
            storeId: row.store?.id || '0',
            productName: row.product?.name || '0',
            productId: row.product?.id || '0',
        }));



    return { success: true, message: "success", status: 200, data: formattedReport, error: "nok"};
  } catch (err) {
    console.error("Error:", err);
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
};





export default ProductForDispatch