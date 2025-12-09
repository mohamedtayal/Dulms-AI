const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow = null;
const isDev = !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 400,
    minHeight: 600,
    title: 'MOSTAFA AI',
    backgroundColor: '#0f172a',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000/chatbot-mohamed/');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Simple menu
  const menu = Menu.buildFromTemplate([
    {
      label: 'ملف',
      submenu: [
        { label: 'خروج', accelerator: 'Alt+F4', click: () => app.quit() }
      ]
    },
    {
      label: 'عرض',
      submenu: [
        { label: 'إعادة تحميل', accelerator: 'Ctrl+R', role: 'reload' },
        { label: 'تكبير', accelerator: 'Ctrl+Plus', role: 'zoomIn' },
        { label: 'تصغير', accelerator: 'Ctrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'ملء الشاشة', accelerator: 'F11', role: 'togglefullscreen' },
        { label: 'أدوات المطور', accelerator: 'F12', role: 'toggleDevTools' }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
