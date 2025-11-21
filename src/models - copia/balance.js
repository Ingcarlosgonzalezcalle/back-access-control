import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()
 
const Model = sequelize.define('balances', {
  id: {    
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'balances'
});

Model.sync();
export default Model;