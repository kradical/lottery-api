import expressApp from './app/app';

const port = process.env.PORT || 3000;

const httpServer = expressApp.listen(port);

console.log(`App listening on port ${port}`);

const shutdown = (): void => {
  httpServer.close();
  console.log('\nApp shutdown');
  process.exit(0);
};

process.on(
  'unhandledRejection',
  (reason: unknown): void => {
    console.error(reason);
    process.exit(1);
  }
);

process.on(
  'uncaughtException',
  (error: Error): void => {
    console.error(error);
    process.exit(1);
  }
);

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
