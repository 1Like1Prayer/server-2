import * as mongoose from 'mongoose';
import * as nconf from 'nconf';
import { logger } from '../logs/logger';

export const mongoConnect = async () => {
    try {
        await mongoose.connect(nconf.get('database').mongoUrl, {
            useNewUrlParser: true,
            autoReconnect: true,
            reconnectInterval: 1000,
        });
        mongoose.connection.on('disconnected', () => {
            logger.info('db disconnected,trying to reconnect');
        });
        mongoose.connection.on('reconnected', () => {
            logger.info('db reconnected');
        });
        logger.info(`connected successfully to db`);
    } catch (err) {
        logger.info(`error----> ${err}`);
    }
};
