import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()

const variable = 0

 
const Data = sequelize.define('data', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  product: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'data'
});

Data.sync();
export default Data;