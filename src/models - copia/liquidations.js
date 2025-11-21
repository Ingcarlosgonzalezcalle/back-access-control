import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()
 
const Model = sequelize.define('liquidations', {
  id: {    
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  initialBalance: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  finalBalance: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  input: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  output: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  consumption: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  generation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  dispatch: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  positive: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  negative: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  bags: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  },
}, {
  tableName: 'liquidations'
});




Model.sync();
export default Model;