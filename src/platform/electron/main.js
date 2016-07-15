/* global process */
const electron = require('electron');
const {app, session, BrowserWindow} = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
	// Create the browser window.
	mainWindow = new BrowserWindow({width: 1280, height: 900, icon: __dirname + '/Icon.ico'});

	// and load the index.html of the app.

	mainWindow.loadURL(`file://${app.getAppPath()}/index.html`);

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	let mhandler = function(details, callback) {
		details.requestHeaders['Cookie'] = 'isAdult=1;';
		details.requestHeaders['Referer'] = 'http://www.dm5.com/';
		callback({cancel: false, requestHeaders: details.requestHeaders});

		return {
			requestHeaders: details.requestHeaders
		};
	};

	session.defaultSession.webRequest.onBeforeSendHeaders({
		urls: ['http://www.dm5.com/m*/', 'http://www.dm5.com/m*/chapterfun*']
	}, mhandler);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
