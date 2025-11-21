import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()

const variable = 0

 
const Module = sequelize.define('modules', {
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
  icon: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
}, {
  tableName: 'modules'
});

Module.sync();
export default Module;