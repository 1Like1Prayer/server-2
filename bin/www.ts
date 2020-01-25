import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import { nconf } from '../config/configuration';
import { mongoConnect } from '../data/database-connection';
import { logger } from '../logs/logger';
import { router } from '../src/routes/router';

const app = new Koa();

const listen = () => {
    app.listen(nconf.get('port'), () => logger.log({
        level: 'info',
        message: `listening on port ${nconf.get('port')}`,
    }));
};

app.use(bodyParser()).use(router.routes()).use(router.allowedMethods());
mongoConnect(listen);

process.on('uncaughtException', (err) => {
    logger.log({
        level: 'error',
        message: `unexpectedException ----> ${err}`,
    });
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    logger.log({
        level: 'error',
        message: `unexpected rejection ----> ${err}`,
    });
    process.exit(1);
});
