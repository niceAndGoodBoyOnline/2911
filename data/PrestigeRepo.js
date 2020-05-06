const Prestige = require('../models/Prestige');

//-------------------------------------------------------------------------------------------------------------------
// The Repo files are responsible for database transactions. They grab, update, delete, create stuff in the database.
// They use query commands to interact with the database. Similar-ish enough for you to understand a bit.
//-------------------------------------------------------------------------------------------------------------------


class PrestigeRepo {
    PrestigeRepo() {        
    }

    // Get all items from the database
    async getPrestigeItems() {
        // Find all items in the database.
        // find() means to get all.
        // exec() means to execute the query command.
        let prestige = await Prestige.find().exec();
        return prestige;
    }

    async getPrestigeIndex(name){
        let prestigeItems = await Prestige.find().exec();
        for(let i=0;i<prestigeItems.length;i++){
            if(prestigeItems[i].item == name){
                return i
            }
        }
    }
}
module.exports = PrestigeRepo;

