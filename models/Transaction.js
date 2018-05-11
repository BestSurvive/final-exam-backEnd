const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    account1: {type: String, required: true},
    account2: {type: String, required: true},
    amount: {type: Number, required: true}
});
module.exports = mongoose.model('Transaction', transactionSchema);




