import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as nconf from 'nconf';
import { logger } from './logs/logger';
import { router } from './routes/router';

const app = new Koa();
app.use(bodyParser()).use(router.routes()).use(router.allowedMethods());
router.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        process.env.NODE_ENV === 'production' ? logger.error('Internal Server Error 500') :
            logger.error(err.toString());
    }
});

export const listen = () => {
    app.listen(nconf.get('port'), () => logger.info(`listening on port ${nconf.get('port')}`));
};
