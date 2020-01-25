import * as mongoose from 'mongoose';

export interface ProductInterface {
    name: string;
    description: string;
    price: number;
    amount: number;
}

export interface ProductInCart {
    name: string;
    amount: number;
}

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
}, { versionKey: false });

export const Product = mongoose.model('Product', productSchema);
