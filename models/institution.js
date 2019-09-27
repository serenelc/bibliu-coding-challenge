var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var InstitutionSchema = new Schema(
  {
    name: {type: String, required: true, max: 100},
    url: {type: String, max: 100},
    email_domain: {type: String, require: true, max: 100}
  }
);

//Export model
module.exports = mongoose.model('Institution', InstitutionSchema);