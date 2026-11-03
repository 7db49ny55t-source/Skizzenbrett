// Gives the web app one extra ability in the desktop app: hand a G-code file straight to Estlcam.
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('skzDesk',{estlcam:(name,text)=>ipcRenderer.invoke('skz-estlcam',String(name),String(text))});
