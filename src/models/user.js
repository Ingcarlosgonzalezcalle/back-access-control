import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()

 
const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}
, {
  tableName: 'users',
  timestamps: false
});

User.sync();
export default User;