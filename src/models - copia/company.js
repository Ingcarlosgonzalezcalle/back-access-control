import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()

const variable = 0

 
const Company = sequelize.define('companies', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  numberId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'companies'
});

Company.sync();
export default Company;