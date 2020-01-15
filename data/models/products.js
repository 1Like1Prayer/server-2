const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    amount: {type: Number, required: true}
}, {versionKey: false});

exports.Product = mongoose.model('Product', productSchema);

