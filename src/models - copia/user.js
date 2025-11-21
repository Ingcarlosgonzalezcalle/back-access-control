import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()

 
const User = sequelize.define('users', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  state: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },  
  lastCompany: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 1
  },
}
, 
{
  indexes: [
    {
      unique: true,
      fields: ['username', 'clientId'] // Restricción única compuesta
    }
  ]
}
, {
  tableName: 'users'
});

User.sync();
export default User;