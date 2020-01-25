import { Product, ProductInCart, ProductInterface } from '../../data/models/products';
import { joiCheckOutSchema, joiProductSchema } from '../../data/validations/product-validation';
import { logger } from '../../logs/logger';

export const getProducts = async () => await Product.find();

export const getProductById = async (id: string) => {
    const product = await Product.findById(id);
    if (product) {
        return product;
    } else {
        const err = new Error('product not found');
        // @ts-ignore
        err.status = 404;
        throw err;
    }
};

export const addProduct = async (product: ProductInterface) => {
    const { error } = joiProductSchema.validate(product);
    if (error) {
        error.name = 'ValidationError';
        throw error;
    }
    return await new Product({
        name: product.name,
        description: product.description,
        price: product.price,
        amount: product.amount,
    }).save();
};

export const editProduct = async (id: string) => {
    const product = await Product.findOneAndUpdate({ _id: id }, { price: 400 }, { new: true });
    if (product) {
        return product;
    } else {
        const err = new Error('product not found');
        // @ts-ignore
        err.status = 404;
        throw err;
    }
};

export const deleteProduct = async (id: string) => {
    const product = await Product.findOneAndRemove({ _id: id });
    if (product) {
        return product;
    } else {
        const err = new Error('product not found');
        // @ts-ignore
        err.status = 404;
        throw err;
    }
};

export const checkOut = async (products: ProductInCart[]) => {
    for (let prod of products) {
        const { error } = joiCheckOutSchema.validate(prod);
        if (error) {
            error.name = 'ValidationError';
            throw error;
        }
        // @ts-ignore
        const { amount } = await Product.findOne({ name: prod.name });
        // @ts-ignore
        prod = await Product.findOneAndUpdate({ name: prod.name }, { amount: amount - prod.amount }, { new: true });
        if (!prod) {
            const err = new Error('product not found');
            // @ts-ignore
            err.status = 404;
            throw err;
        }
    }
    return await Product.find();
};

const errorResolver = {
    ['400']: () => 'invalid ID or Body. ',
    ['404']: () => 'Not Found. ',
    ['500']: () => 'internal server error. ',
};

const mongooseErrorResolver = {
    ['ValidationError']: () => 400,
    ['CastError']: () => 400,
};

export const mongooseErrorHandler = (err: Error) => {
    if (mongooseErrorResolver.hasOwnProperty(err.name)) {
        // @ts-ignore
        err.status = mongooseErrorResolver[err.name]();
    }
    return err;
};

export const errorHandler = (err: Error) => {
    logger.log({
        level: 'error',
        // @ts-ignore
        message: `${errorResolver[err.status]()} ${err.message} status--> ${err.status}`,
    });
};
