const config = require('./config')
const getCredentials = require('./browser').initialize
const { app } = require('electron')

app.on('ready', () => {
  config.loadCredentials()
  .catch(()=> {})
  .then(credentials => {
    if (credentials && Date.parse(credentials.Expiration) > new Date()) {
      return credentials;
    } else {
      return getCredentials();
    }
  })
  .then(JSON.stringify)
  .then(console.log)
  .finally(app.quit)
});