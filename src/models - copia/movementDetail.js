import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()
 
const Model = sequelize.define('movement_details', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  movementId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  machineId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  machineName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  time: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  operationType: {
    type: DataTypes.UUID,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  state: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'movement_details'
});

Model.sync();
export default Model;