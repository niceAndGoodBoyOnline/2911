var mongoose              = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// User Schema
var userSchema = mongoose.Schema({
  username: {
    type: String,
    index:true // Index ensures property is unique in db.
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  prestige: {type: Array},
  items : {type: Array},
  bitcoin: {type: Number, default: 0},
  prestigePoints: {type: Number, default: 0}
});
userSchema.plugin(passportLocalMongoose);
var User = module.exports = mongoose.model('users', userSchema);
module.exports = User;
