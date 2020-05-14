const axios = require('axios');

module.exports = {

  checkPasswordValidation(email){
    return axios
    .post('http://localhost:3000/user/RegisterUser', {email:'55', username:'55', password:'$Slider23', passwordConfirm:'$Slider233'})
    .then(res => res.data)
    .catch(error => console.log(error));
  },

  checkPasswordStrengthValidation(email){
    return axios
    .post('http://localhost:3000/user/RegisterUser', {email:'55', username:'55', password:'k', passwordConfirm:'k'})
    .then(res => res.data)
    .catch(error => console.log(error));
  },

  checkExistingEmail(email){
    return axios
    .post('http://localhost:3000/user/RegisterUser', {email:email, username:'testfail', password:'$Slider23', passwordConfirm:'$Slider23'})
    .then(res => res.data)
    .catch(error => console.log(error));
  },

  makeUser(email){
    return axios
    .post('http://localhost:3000/user/RegisterUser', {email:email, username:'test', password:'$Slider69', passwordConfirm:'$Slider69'})
    .then(res => res.data)
    .catch(error => console.log(error));
  },

  checkExistingUser(email){
    return axios
    .post('http://localhost:3000/user/RegisterUser', {email:'123', username:'test', password:'$Slider69', passwordConfirm:'$Slider69'})
    .then(res => res.data)
    .catch(error => console.log(error));
  },

  getBitcoin(email) {
    return axios
      .post("http://localhost:3000/user/getBitcoin", {email:email})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  getItemArray(email) {
    return axios
      .post("http://localhost:3000/user/getItemArray", {email:email})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  makeTransaction(email) {
    return axios
      .post("http://localhost:3000/user/makeTransaction", {email:email, index:0})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  saveProgress(email) {
    return axios
      .post("http://localhost:3000/user/saveProgress", {email:email, bitcoin:0})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  getPrestigePoints(email) {
    return axios
      .post("http://localhost:3000/user/getPrestigePoints", {email:email})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  savePrestigePoints(email) {
    return axios
      .post("http://localhost:3000/user/savePrestigeProgress", {email:email, prestigePoints:0})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  makePrestigeTransaction(email) {
    return axios
      .post("http://localhost:3000/user/makePrestigeTransaction", {email:email, index:0})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  resetGainPrestige(email) {
    return axios
      .post("http://localhost:3000/user/resetGainPrestige", {email:email})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  getUserPrestigeItems(email) {
    return axios
    .post("http://localhost:3000/user/getUserPrestigeItems", {email:email})
    .then(res => res.data)
    .catch(error => console.log(error))
  }

};