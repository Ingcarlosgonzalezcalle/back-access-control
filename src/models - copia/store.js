import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()
 
const Model = sequelize.define('stores', {
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
    type: DataTypes.INTEGER,
    allowNull: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: 'stores'
});

Model.sync();
export default Model;