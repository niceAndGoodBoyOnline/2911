const RequestService = require('../services/RequestService');
const Item           = require('../models/Item');
const ItemRepo       = require('../data/ItemRepo');
const _itemRepo      = new ItemRepo();

//Get all the items from the database
exports.getItems = async function(req, res){
    //Call getItems() in ItemRepo.js and assign returned value to items
    let items = await _itemRepo.getItems()

    //return the result back into Angular
    return res.json(items)
}

