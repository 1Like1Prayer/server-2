import * as Router from 'koa-router';
import * as productController from '../controllers/products-controller';
export const router = new Router();

router.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        err = productController.mongooseErrorHandler(err);
        err.status = err.statusCode || err.status || 500;
        ctx.status = err.status;
        ctx.body = err.message;
        productController.errorHandler(err);
    }
});

router.get('/products', async (ctx) => {
    ctx.body = await productController.getProducts();
});

router.get('/products/:id', async (ctx) => {
    ctx.body = await productController.getProductById(ctx.params.id);
});

router.post('/product', async (ctx) => {
    ctx.body = await productController.addProduct(ctx.request.body);
});

router.put('/product/:id', async (ctx) => {
    ctx.body = await productController.editProduct(ctx.params.id);
});
router.delete('/product/:id', async (ctx) => {
    ctx.body = await productController.deleteProduct(ctx.params.id);
});

router.post('/checkout', async (ctx) => {
    ctx.body = await productController.checkOut(ctx.request.body);
});
