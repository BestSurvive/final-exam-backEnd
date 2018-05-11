const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  name: {type: String, required: true},
  surname: {type: String, required: true},
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  iban: {type: String, unique: true, required: true},
  credit: {type: Number, default:1000},
  transaction: [{type: Schema.Types.ObjectId, ref:'Transaction'}]
});

module.exports = mongoose.model('Account', accountSchema);




