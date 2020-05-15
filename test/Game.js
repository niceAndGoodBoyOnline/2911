const axios = require('axios');

module.exports = {
  getItems() {
    return axios
      .get("http://localhost:3000/Game/getItems")
      .then(res => res.data)
      .catch(error => console.log(error));
  },

  getPrestigeItems() {
    return axios
      .get("http://localhost:3000/Game/getPrestigeItems")
      .then(res => res.data)
      .catch(error => console.log(error))
  },

  getFirewalls() {
    return axios
    .get('http://localhost:3000/Game/getFirewalls')
    .then(res => res.data)
    .catch(error => console.log(error))
  }

};