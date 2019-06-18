import express from 'express';

import routes from './routes';

// Create Express App
const app = express();

// Routes
app.use('/', routes);

export default app;
