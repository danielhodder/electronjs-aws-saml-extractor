const temprary_credential_location = require('./options').config_file
const util = require("util");
const fs = require('fs');

/**
 * 
 * @param {*} credentialData 
 */
function saveCredentials(credentialData) {
  return util.promisify(fs.writeFile)(temprary_credential_location, JSON.stringify(credentialData, null, 2));
}

function loadCredentials() {
  return util.promisify(fs.readFile)(temprary_credential_location).then(JSON.parse)
}

module.exports = { loadCredentials, saveCredentials }