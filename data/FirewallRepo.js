const Firewall = require('../models/Firewall');

//-------------------------------------------------------------------------------------------------------------------
// The Repo files are responsible for database transactions. They grab, update, delete, create stuff in the database.
// They use query commands to interact with the database. Similar-ish enough for you to understand a bit.
//-------------------------------------------------------------------------------------------------------------------


class FirewallRepo {
    FirewallRepo() {        
    }

    // Get all firewalls from the database
    async getFirewalls() {
        // Find all firewalls in the database.
        // find() means to get all.
        // exec() means to execute the query command.
        let firewalls = await Firewall.find().exec();
        return firewalls;
    }

    // Get the index of a certain firewall
    async getIndex(rank) {
        // Find all firewalls in the database
        // find() means to get all
        // exec() means to execute the query command
        let firewalls = await Firewall.find().exec();
        // for each firewall
        for(let i=0;i<firewalls.length;i++){
            // if the firewall matches the passed nrank
            if(firewalls[i].firewall == rank){
                // return the index
                return i
            }
        }
    }
}
module.exports = FirewallRepo;

