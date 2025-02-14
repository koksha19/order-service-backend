const swaggerUi = require('swagger-ui-express');
const yamljs = require('yamljs');
const path = require('path');

const swaggerFile = yamljs.load(path.resolve(__dirname, 'swagger.yaml'));

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
};

module.exports = setupSwagger;
