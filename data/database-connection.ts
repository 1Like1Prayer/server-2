import * as mongoose from 'mongoose';
import { nconf } from '../config/configuration';
import { logger } from '../logs/logger';

export const mongoConnect = (callback: any) => {
    mongoose.connect(nconf.get('mongoUrl'), { useNewUrlParser: true })
        .then(() => {
            logger.log({
                level: 'info',
                message: `connected successfully to db`,
            });
            callback();
        })
        .catch((err) => logger.log({
            level: 'info',
            message: `error----> ${err}`,
        }));
};
