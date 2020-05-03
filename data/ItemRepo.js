const Item = require('../models/Item');

class ItemRepo {
    ItemRepo() {        
    }

    async getItems() {
        let items = await Item.find().exec();
        return items;
    }

    async getIndex(name) {
        let items = await Item.find().exec();
        for(let i=0;i<items.length;i++){
            if(items[i].item == name){
                return i
            }
        }
    }
}
module.exports = ItemRepo;

