var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    name: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    role: {type: String, required: true, enum: ['student', 'academic', 'administrator']},
    password: {type: String, required: true, min: 6, max: 20},
  }
);

//Export model
module.exports = mongoose.model('User', UserSchema);