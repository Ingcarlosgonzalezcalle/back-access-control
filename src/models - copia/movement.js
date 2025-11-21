import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()
 
const Model = sequelize.define('movements', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  storeName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  operationType: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  productName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  cycles: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  presentation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  bags: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  description: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  ticket: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  finished: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },  
  origin: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  destination: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'movements'
});




Model.sync();
export default Model;