const Item = require('../models/Item');

//-------------------------------------------------------------------------------------------------------------------
// The Repo files are responsible for database transactions. They grab, update, delete, create stuff in the database.
// They use query commands to interact with the database. Similar-ish enough for you to understand a bit.
//-------------------------------------------------------------------------------------------------------------------


class ItemRepo {
    ItemRepo() {        
    }

    // Get all items from the database
    async getItems() {
        // Find all items in the database.
        // find() means to get all.
        // exec() means to execute the query command.
        let items = await Item.find().exec();
        return items;
    }

    // Get the index of a certain item
    async getIndex(name) {
        // Find all items in the database
        // find() means to get all
        // exec() means to execute the query command
        let items = await Item.find().exec();
        // for each item,
        for(let i=0;i<items.length;i++){
            // if the item matches the passed name,
            if(items[i].item == name){
                // return the index
                return i
            }
        }
    }
}
module.exports = ItemRepo;

