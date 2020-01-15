const koa = require('koa');
const app = new koa();
const bodyParser = require('koa-bodyparser');
const router = require('../src/routes/router').router;
const nconf = require('../config/configuration').nconf;
const mongoConnect = require('../data/database-connection').mongoConnect;

const listen = () => {
    app.listen(nconf.get('port'), () => console.log(`listening on port ${nconf.get('port')}`));
};

app.use(bodyParser()).use(router.routes()).use(router.allowedMethods());
mongoConnect(listen);

process.on('uncaughtException', (err) => {
    console.log('unexpectedException ---->' + err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.log('unhandled rejection -------->' + err);
    process.exit(1);
});
