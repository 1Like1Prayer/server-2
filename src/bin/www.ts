import * as mongoose from 'mongoose';
import * as nconf from 'nconf';
import { initConfig } from '../config/configuration';
import { logger } from '../logs/logger';

process.on('uncaughtException', (err) => {
    logger.error(`unexpectedException ----> ${err}`);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    logger.error(`unexpected rejection ----> ${err}`);
    process.exit(1);
});

import { listen } from '../app';
import { mongoConnect } from '../data/database-connection';

initConfig();
(async () => {
    try {
        await mongoConnect();
        listen();
    } catch (error) {
        logger.error(error);
    }
})();
