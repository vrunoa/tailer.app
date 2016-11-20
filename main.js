const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
var win

function quit (err) {
  if (err) {
    console.log(err)
  }
  win = null
  app.quit()
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {
  try {
    var options = {
      width: 1040,
      height: 700,
      'min-width': 600,
      'min-height': 670
    }
    win = new BrowserWindow(options)
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'src', 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
    if (process.env['DEV']) {
      win.openDevTools()
    }
  } catch (err) {
    quit(err)
  }
})
