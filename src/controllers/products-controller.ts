import { ProductInCart } from '../data/models/product-in-cart';
import { Product, ProductInterface } from '../data/models/products';
import { logger } from '../logs/logger';
import { ServerError } from '../models/server-error';
import { joiCheckOutSchema, joiProductSchema } from '../validations/product-validation-schemas';

enum errorMessages {
    NOT_FOUND = 'product not found',
}

export const getProducts = async () => {
    try {
        return await Product.find();
    } catch (err) {
        errorHandler({ message: err.message, status: 404 });
    }
};

export const getProductById = async (id: string) => {
    try {
        const product = await Product.findById(id);
        if (product) {
            return product;
        } else {
            throw { message: errorMessages.NOT_FOUND, status: 404 };
        }
    } catch (err) {
        err.hasOwnProperty('status') ? errorHandler(err) : errorHandler({ message: err.message, status: 400 });
    }
};

export const addProduct = async (product: ProductInterface) => {
    try {
        const { error } = joiProductSchema.validate(product);
        if (error) {
            throw { message: `${error.name} - ${error.message}`, status: 400 };
        }
        return await new Product(product).save();
    } catch (err) {
        err.hasOwnProperty('status') ? errorHandler(err) : errorHandler({ message: err.message, status: 400 });
    }
};

export const editProduct = async (id: string) => {
    try {
        const product = await Product.findByIdAndUpdate(id, { price: 400 }, { new: true });
        if (product) {
            return product;
        } else {
            throw { message: errorMessages.NOT_FOUND, status: 404 };
        }
    } catch (err) {
        err.hasOwnProperty('status') ? errorHandler(err) : errorHandler({ message: err.message, status: 400 });
    }
};

export const deleteProduct = async (id: string) => {
    try {
        const product = await Product.findByIdAndRemove(id);
        if (product) {
            return product;
        } else {
            throw { message: errorMessages.NOT_FOUND, status: 404 };
        }
    } catch (err) {
        err.hasOwnProperty('status') ? errorHandler(err) : errorHandler({ message: err.message, status: 400 });
    }
};

export const checkOut = async (products: ProductInCart[]) => {
    products.map(async (cartProduct: ProductInCart) => {
            try {
                const { error } = joiCheckOutSchema.validate(cartProduct);
                if (error) {
                    throw { message: `${error.name} - ${error.message}`, status: 400 };
                }
                const product = await Product.findOne({ name: cartProduct.name });
                if (!product) {
                    throw { message: errorMessages.NOT_FOUND, status: 404 };
                }
                cartProduct = await Product.findOneAndUpdate({ name: cartProduct.name },
                    { amount: product.amount - cartProduct.amount }, { new: true });
                if (!cartProduct) {
                    throw { message: errorMessages.NOT_FOUND, status: 404 };
                }
            } catch (err) {
                err.hasOwnProperty('status') ? errorHandler(err) :
                    errorHandler({ message: err.message, status: 400 });
            }
        },
    );
    try {
        return await Product.find();
    } catch (err) {
        errorHandler({ message: err.message, status: 404 });
    }
};

export const errorHandler = (err: ServerError) => {
    process.env.NODE_ENV === 'production' ? logger.error('Internal Server Error 500') :
        logger.error(`${err.message} status--> ${err.status}`);
};
