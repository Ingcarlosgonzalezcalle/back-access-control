import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()

 
const User = sequelize.define('persons', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  identification: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}
, {
  tableName: 'persons',
  timestamps: false
});

User.sync();
export default User;