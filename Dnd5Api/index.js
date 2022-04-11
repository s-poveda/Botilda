const axios = require('axios');
module.exports = axios.create({
  baseURL:'https://www.dnd5eapi.co/api'
});
