var mongoose              = require('mongoose');

// Item Schema
var firewallSchema = mongoose.Schema({
  rank: {type: String},
  security: {type: Number},
  reward:{type:Number},
  desc: {type: String}
});
var Firewall = module.exports = mongoose.model('firewalls', firewallSchema);
module.exports = Firewall;
