import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()
 
const Model = sequelize.define('products', {
  id: {    
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  state: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  type: {    
    type: DataTypes.INTEGER, //1. materia prima, 2. proceso, 3 producto
    allowNull: false
  },
}, {
  tableName: 'products'
});

Model.sync();
export default Model;