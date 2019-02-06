const path = require('path')
const glob = require('glob')
const {app, BrowserWindow} = require('electron')
const { session } = require('electron')
const { webContents } = require('electron')
const saml = require('./saml-extrat')
const { parse } = require('qs')
const url = require('./options').url

// Modify the user agent for all requests to the following urls.
const filter = {
  urls: ['https://signin.aws.amazon.com/saml']
}

// const debug = /--debug/.test(process.argv[2])
const debug = false;

if (process.mas) app.setName('SSO Sign in')

let mainWindow = null

function initialize () {
  return new Promise((resolve, reject) => {
    function createWindow () {
      const windowOptions = {
        width: 400,
        minWidth: 400,
        height: 800,
        title: app.getName()
      }
  
      mainWindow = new BrowserWindow(windowOptions)
      mainWindow.loadURL(url)
  
      // Launch fullscreen with DevTools open, usage: npm run debug
      if (debug) {
        mainWindow.webContents.openDevTools()
        // mainWindow.maximize()
        require('devtron').install()
      }
  
      mainWindow.on('closed', () => {
        mainWindow = null
      })
  
      session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
        const contents = details.uploadData[0].bytes.toString();
        const form_data = parse(contents);
        // console.log(form_data.SAMLResponse)
        callback({cancel: true});
  
        require('./assume-role').aquireShortLivedCredentials(form_data.SAMLResponse).then(resolve, reject)
      })
    }
  
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    createWindow();
  });
}

module.exports = { initialize }