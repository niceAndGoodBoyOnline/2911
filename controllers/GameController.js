const RequestService = require('../services/RequestService');
const Item           = require('../models/Item');
const ItemRepo       = require('../data/ItemRepo');
const _itemRepo      = new ItemRepo();


exports.getItems = async function(req, res){
    let items = await _itemRepo.getItems()

    return res.json(items)
}

