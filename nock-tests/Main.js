const axios = require('axios');

module.exports = {
  getItems() {
    return axios
      .get("http://localhost:1337/Game/getItems")
      .then(res => res.data)
      .catch(error => console.log(error));
  }
};