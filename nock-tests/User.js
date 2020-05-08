const axios = require('axios');

module.exports = {
  getBitcoin(email) {
    return axios
      .post("http://localhost:1337/user/getBitcoin", {email:email})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  getItemArray(email) {
    return axios
      .post("http://localhost:1337/user/getItemArray", {email:email})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  makeTransaction(email) {
    return axios
      .post("http://localhost:1337/user/makeTransaction", {email:email, index:0})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  saveProgress(email) {
    return axios
      .post("http://localhost:1337/user/saveProgress", {email:email, bitcoin:0})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  getPrestigePoints(email) {
    return axios
      .post("http://localhost:1337/user/getPrestigePoints", {email:email})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  savePrestigePoints(email) {
    return axios
      .post("http://localhost:1337/user/savePrestigeProgress", {email:email, prestigePoints:0})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  makePrestigeTransaction(email) {
    return axios
      .post("http://localhost:1337/user/makePrestigeTransaction", {email:email, index:0})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  resetGainPrestige(email) {
    return axios
      .post("http://localhost:1337/user/resetGainPrestige", {email:email})
      .then(res => res.data)
      .catch(error => console.log(error));
  },

};