const {Product} = require('../../data/models/products');
const {joiProductSchema, joiCheckOutSchema} = require('../../data/validations/product-validation');
const {logger} = require('../../logs/logger');

exports.getProducts = async () => {
    return await Product.find();
};

exports.getProductById = async (id) => {
    const product = await Product.findById(id);
    if (product) return product;
    else {
        const err = new Error('product not found');
        err.status = 404;
        throw err;
    }
};

exports.addProduct = async (product) => {
    const {error} = joiProductSchema.validate(product);
    if (error) {
        error.name = 'ValidationError';
        throw error;
    }
    return await new Product({
        name: product.name,
        description: product.description,
        price: product.price,
        amount: product.amount
    }).save();
};

exports.editProduct = async (id) => {
    const product = await Product.findOneAndUpdate({_id: id}, {price: 500}, {new: true});
    if (product) return product;
    else {
        const err = new Error('product not found');
        err.status = 404;
        throw err;
    }
};

exports.deleteProduct = async (id) => {
    const product = await Product.findOneAndRemove({_id: id});
    if (product) return product;
    else {
        const err = new Error('product not found');
        err.status = 404;
        throw err;
    }
};

exports.checkOut = async (products) => {
    for (let prod of products) {
        const {error} = joiCheckOutSchema.validate(prod);
        if (error) {
            error.name = 'ValidationError';
            throw error;
        }
        const {amount} = await Product.findOne({name: prod.name});
        prod = await Product.findOneAndUpdate({name: prod.name}, {amount: amount - prod.amount}, {new: true});
        if (!prod) {
            const err = new Error('product not found');
            err.status = 404;
            throw err;
        }
    }
    return await Product.find();
};

const errorResolver = {
    ['400']: () => 'invalid ID or Body. ',
    ['404']: () => 'Not Found. ',
    ['500']: () => 'internal server error. '
};

const mongooseErrorResolver = {
    'ValidationError': () => 400,
    'CastError': () => 400
};

exports.mongooseErrorHandler = (err) => {
    if (mongooseErrorResolver.hasOwnProperty(err.name)) {
        err.status = mongooseErrorResolver[err.name]();
    }
    return err;
};

exports.errorHandler = (err) => {
    logger.log({
        level: 'error',
        message: `${errorResolver[err.status]()} ${err.message} status--> ${err.status}`
    });
};
