const RequestService = require('../services/RequestService');
const Item           = require('../models/Item');
const ItemRepo       = require('../data/ItemRepo');
const _itemRepo      = new ItemRepo();

const Prestige       = require('../models/Prestige');
const PrestigeRepo   = require('../data/PrestigeRepo')
const _prestigeRepo  = new PrestigeRepo();

const Firewalls       = require('../models/Firewall');
const FirewallRepo   = require('../data/FirewallRepo')
const _firewallRepo  = new FirewallRepo();

const CommandRepo   = require('../data/CommandRepo')
const _commandRepo  = new CommandRepo();

//Get all the items from the database
exports.getItems = async function(req, res){
    //Call getItems() in ItemRepo.js and assign returned value to items
    let items = await _itemRepo.getItems()

    //return the result back into Angular
    res.json(items)
}

// Get all prestige items from the database
exports.getPrestigeItems = async function(req, res){
    // Call getPrestigeItems() in ItemRepo.js and get returned value
    let prestigeItems = await _prestigeRepo.getPrestigeItems()

    // return the result back into Angular
    res.json(prestigeItems)
}

exports.getFirewalls = async function(req,res){
    let firewallList = await _firewallRepo.getFirewalls();

    res.json(firewallList)
}


exports.getCommands = async function(req,res){
    let commandList = await _commandRepo.getCommands();

    res.json(commandList)
}