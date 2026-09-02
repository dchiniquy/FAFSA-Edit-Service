const express = require('express');
const healthRoute = require('./routes/health.route');
const validateRoute = require('./routes/validate.route');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Factory (no app.listen here) so tests can exercise the app directly via supertest.
function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/health', healthRoute);
  app.use('/api/v1/applications', validateRoute);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
