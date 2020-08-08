const dndApi = require('./index.js');

const spellSearch = async (nameToSearch, callBackOnZeroResults, callBackOnOneResult, callBackOnTwoPlusResults) => {
  nameToSearch = nameToSearch.trim().replace(/ /g, '+');
  let searchResult = null;
  console.log(nameToSearch);
  dndApi.get(`api/spells/?name=${nameToSearch}`)
  .then( (res) => {
    searchResult = res.data;
    console.log('1st response', searchResult);

    if (searchResult.count === 0) { return callBackOnZeroResults(searchResult); }
    if (searchResult.count === 1) {
      dndApi.get(`${searchResult.results[0].url}`)
      .then(
        (res) => {
          console.log('2nd response', res.data);
          searchResult = res.data;
          callBackOnOneResult(searchResult);
        },
        e => console.log('There was an error:\n', e) );
    }
    // if (searchResult.count >= 2) {
    //
    // }
    }, e =>{ console.log(e); }
  );
}

module.exports = spellSearch;
