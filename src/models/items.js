const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemsSchema = new Schema({
    name:{type: String},
    description:{type: String},
    photoName:{type: String},
    photoPath:{type: String},
    photoHash:{type: String},
    photoUrl:{ type: String },
    stock: {type: Boolean,default: true}
});

module.exports = mongoose.model('Items',ItemsSchema);