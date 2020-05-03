const User = require('../models/User');

class UserRepo {
    UserRepo() {        
    }

    async getUserByEmail(email) {
        var user = await User.findOne({email: email});
        if(user) {
            let respose = { obj: user, errorMessage:"" }
            return respose;
        }
        else {
            return null;
        }
    }

    async getRolesByUsername(username) {
        var user = await User.findOne({username: username}, {_id:0, roles:1});
        if(user.roles) {
            return user.roles;
        }
        else {
            return [];
        }
    }    

    async getBitcoin(email) {
        var user = await User.findOne({email: email});
        
        let bitcoin = user.bitcoin
        console.log(bitcoin)

        return bitcoin
    }

    async saveProgress(email, bitcoin) {
        let updated = await User.updateOne(
            { email:email},
            {$set: {bitcoin:bitcoin}}
        )
        return "Progress has been saved. You can safely close the browser."
    }

    async makeTransaction(email, index) {
        let user = await User.findOne({email:email});
        let itemsArray = user.items
        itemsArray[index] = itemsArray[index] + 1
        console.log(itemsArray)
        let updated = await User.updateOne(
            {email:email},
            {$set: {items:itemsArray}}
        )
        return "Thank you come again!"
    }

    async getItemArray(email){
        let user = await User.findOne({email:email})
        return user.items
    }

    async autoBitcoin(){
        // let users = await User.find().exec()
        let updated = await User.updateMany(
            { },
            {$inc: {bitcoin:5}}
        )
        return updated
    }

    async checkUser(email, username){
        let user = await User.findOne({email:email})
        console.log(user)
        if(user){
            return "User already exists with that email."
        }
        let user2 = await User.findOne({username:username})
        console.log(user)
        if(user2){
            return "User already exists with that username."
        }

        return ''
    }
}
module.exports = UserRepo;

