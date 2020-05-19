var mongoose              = require('mongoose');

// Command Schema
var commandSchema = mongoose.Schema({
  command: {type: String},
  function: {type: String},
  desc: {type: String}
});

var Command = module.exports = mongoose.model('commands', commandSchema);
module.exports = Command;
