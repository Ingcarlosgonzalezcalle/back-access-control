import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()
 
const Model = sequelize.define('operation_types', {
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
  type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },  
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }, 
}, {
  tableName: 'operation_types'
});

Model.sync();
export default Model;