import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';


const __dirname = path.resolve();
const ruta = `${path.join(__dirname, 'src/routes/*.js')}`
const composterRoutes = `${path.join(__dirname, 'src/routes/composter/*.js')}`
const dasboardRoutes = `${path.join(__dirname, 'src/routes/dashboard/*.js')}`
const generalRoutes = `${path.join(__dirname, 'src/routes/general/*.js')}`
console.log(__dirname)
console.log(ruta)

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Nombre de tu API',
      version: '1.0.0',
      description: 'Documentación de tu API con Swagger',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [ruta,composterRoutes,generalRoutes], // Rutas de tus archivos de ruta
};

const specs = swaggerJsdoc(options);

export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};