import { Sequelize } from "sequelize";
import dotenv from 'dotenv'

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || "mssql",
  port: process.env.DB_PORT,
  timezone: '-05:00',
  define: {
    timestamps: true,
    freezeTableName: true
  }
})

const conectDb = () => {
  sequelize.authenticate().then(() => {
    console.log("Connection has been established successfully.");
  }).catch((err) => {
    console.log("Error connecting to database", err);
  });
  return sequelize;
};

export { sequelize };
export default conectDb;
