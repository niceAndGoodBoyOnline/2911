var mongoose              = require('mongoose');

// Prestige Schema
var prestigeSchema = mongoose.Schema({
  item: {type: String},
  price: {type: Number},
  power: {type: Number}
});
var Prestige = module.exports = mongoose.model('Prestige', prestigeSchema);
module.exports = Prestige;
