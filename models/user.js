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

// Virtual for user's email domain
UserSchema
.virtual('email_domain')
.get(function () {
    const domainStartIndex = this.email.indexOf("@") + 1;
    return this.email.substring(domainStartIndex, this.email.length);
});

//Export model
module.exports = mongoose.model('User', UserSchema);