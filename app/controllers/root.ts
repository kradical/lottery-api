import { Request, Response } from 'express';

// Hello World on '/'
const root = (request: Request, response: Response): void => {
  response.json({ message: 'Hello World' });
};

export default root;
