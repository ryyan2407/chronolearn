import { env } from "./config/env.js";
import { prisma } from "./config/db.js";
import { app } from "./app.js";
import { logger } from "./utils/logger.js";

const start = async () => {
  await prisma.$connect();

  app.listen(env.PORT, () => {
    logger.info(`ChronoLearn server listening on port ${env.PORT}`);
  });
};

start().catch(async (error) => {
  logger.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
