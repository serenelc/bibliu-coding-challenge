var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//A book should have a list of institutions which has access to it.

var BookSchema = new Schema(
  {
    title: {type: String, required: true},
    author: {type: String, required: true},
    isbn: {type: String, required: true},
    institutions: [{type: Schema.Types.ObjectId, ref: 'Institution'}]
  }
);

//Export model
module.exports = mongoose.model('Book', BookSchema);