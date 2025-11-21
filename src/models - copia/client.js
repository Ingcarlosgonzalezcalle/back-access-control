import { DataTypes } from 'sequelize';
import conectDb from '../config/db.js'
const sequelize = conectDb()

 
const Client = sequelize.define('clients', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  identification: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING(20) ,
    allowNull: false,
    validate: {
      isIn: [['PALMA', 'EXTRACTURA', 'BANANO']]
    }
  },
  state: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  } ,
  company: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }  
}, {
  tableName: 'clients'
});

Client.sync();

export default Client;