var mongoose              = require('mongoose');

// Item Schema
var firewallSchema = mongoose.Schema({
  rank: {type: String},
  securityMod: {type: Number},
  rewardMod:{type:Number},
  image: {type: String},
  name: {type: String},
  desc: {type: String}
});
var Firewall = module.exports = mongoose.model('firewalls', firewallSchema);
module.exports = Firewall;
