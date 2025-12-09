/**
 * MOSTAFA AI - Electron Preload Script
 * يوفر جسر آمن بين الـ renderer و main process
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Get app version
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Get platform
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // Listen for new chat event from menu
  onNewChat: (callback) => {
    ipcRenderer.on('new-chat', callback);
  },
  
  // Remove listener
  removeNewChatListener: () => {
    ipcRenderer.removeAllListeners('new-chat');
  }
});

// Log that preload script has loaded
console.log('MOSTAFA AI: Preload script loaded');
