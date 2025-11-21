import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()
 
const DataDetails = sequelize.define('dataDetails', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  dataId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  xValue: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  yValue: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
    company: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'dataDetails'
});

DataDetails.sync();
export default DataDetails;