import { Request, Response } from 'express';

// 404 Handler
const notFound = (_: Request, response: Response): void => {
  console.error('Route Not Found');

  response.status(404);

  throw new Error('Route Not Found');
};

export default notFound;
