// Skizzenbrett desktop: a window around the web app. It always loads the newest version from GitHub Pages;
// without internet the app's own offline cache answers, and on a very first start offline the built-in copy is used.
const {app,BrowserWindow,shell}=require('electron');
const path=require('path');

const APP_URL='https://7db49ny55t-source.github.io/Skizzenbrett/';
const LOCAL=path.join(__dirname,'app','index.html');

if(!app.requestSingleInstanceLock())app.quit();
let win=null;

function create(){
  win=new BrowserWindow({width:1400,height:900,minWidth:800,minHeight:560,backgroundColor:'#1a1c1f',title:'Skizzenbrett',autoHideMenuBar:true,
    icon:path.join(__dirname,'build','icon.png'),webPreferences:{contextIsolation:true,sandbox:true}});
  // links to other sites open in the normal browser, never inside the app
  win.webContents.setWindowOpenHandler(({url})=>{shell.openExternal(url);return{action:'deny'}});
  win.webContents.on('will-navigate',(e,url)=>{if(!url.startsWith(APP_URL)&&!url.startsWith('file:')){e.preventDefault();shell.openExternal(url)}});
  let fallback=false;
  win.webContents.on('did-fail-load',(e,code,desc,url,isMain)=>{if(isMain&&!fallback&&code!==-3){fallback=true;win.loadFile(LOCAL)}});
  // the site answers but not with the app (e.g. 404 while GitHub Pages is not set up yet)
  win.webContents.on('did-navigate',(e,url,code)=>{if(!fallback&&url.startsWith(APP_URL)&&code>=400){fallback=true;win.loadFile(LOCAL)}});
  win.loadURL(APP_URL).catch(()=>{});
}

app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.focus()}});
app.whenReady().then(create);
app.on('window-all-closed',()=>app.quit());
