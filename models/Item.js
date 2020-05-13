var mongoose              = require('mongoose');

// Item Schema
var itemSchema = mongoose.Schema({
  item: {type: String},
  price: {type: Number},
  power: {type: Number},
  desc: {type: String}
});
var Item = module.exports = mongoose.model('items', itemSchema);
module.exports = Item;
