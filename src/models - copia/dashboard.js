import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()

 
const Dashboard = sequelize.define('dashboards', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.UUID,
    allowNull: false
  },
  client: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'dashboards'
});

Dashboard.sync();
export default Dashboard;