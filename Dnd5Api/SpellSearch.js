const dndApi = require('./index.js');

const spellSearch = async (nameToSearch, callBackOnZeroResults, callBackOnOneResult) => {
  nameToSearch = nameToSearch.toLowerCase().trim().replace(/ /g, '-');
  let searchResult = null;
  dndApi.get(`/spells/${nameToSearch}`)
  .then( res => {
      searchResult = res.data;
      console.log('RESPONSE:',searchResult);
          searchResult = res.data;
          callBackOnOneResult(searchResult);
    },  e => {
          console.log('There was an error:\n', e);
          callBackOnZeroResults(searchResult);
        }

  );

}

module.exports = spellSearch;
