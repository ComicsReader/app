/* global process */
const electron = require('electron');
const windowStateKeeper = require('electron-window-state');
const {app, session, BrowserWindow} = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let isQuitting = false;

function createWindow () {
	let mainWindowState = windowStateKeeper({
		defaultWidth: 1280,
		defaultHeight: 800
	});

	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: mainWindowState.width,
		height: mainWindowState.height,
		x: mainWindowState.x,
		y: mainWindowState.y,
		icon: __dirname + '/Icon.ico',
		darkTheme: true,
		autoHideMenuBar: true,
		titleBarStyle: 'hidden-inset',
		webPreferences: {
			webSecurity: false
		}
	});

	// Let us register listeners on the window, so we can update the state
	// automatically (the listeners will be removed when the window is closed)
	// and restore the maximized or full screen state
	mainWindowState.manage(mainWindow);


	if (process.env.NODE_ENV === 'development') {
		// and load the index.html of the app.
		mainWindow.loadURL('http://localhost:8080');

		const installExtension = require('electron-devtools-installer').default;
		const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');

		installExtension(REACT_DEVELOPER_TOOLS).then(() => {
			installExtension(REDUX_DEVTOOLS).then(() => {
				mainWindow.openDevTools();
			});
		});
	} else {
		// and load the index.html of the app.
		mainWindow.loadURL(`file://${app.getAppPath()}/index.html`);
	}

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();
	mainWindow.on('close', e => {
		if (!isQuitting) {
			e.preventDefault();

			if (process.platform === 'darwin') {
				app.hide();
			} else {
				mainWindow.hide();
			}
		}
	});

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

app.on('before-quit', () => {
	isQuitting = true;
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
