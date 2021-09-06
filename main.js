const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

const { writeFile } = require('fs')
const { ipcMain, dialog } = require('electron');

ipcMain.on('render/salvar_arquivo', async function(event, mensagem) {
  const conteudoDoArquivo = mensagem;

  console.log(conteudoDoArquivo);

  const { filePath, canceled } =  await dialog.showSaveDialog();

  if(canceled) {
    event.reply('main/salvar_arquivo', {status: 400, msg: 'Cancelado pelo usuario'})
    return false;
  }

  writeFile(filePath, conteudoDoArquivo, 'utf-8', function(){
    console.log(err, result);
    console.log(filePath);  
    event.reply('main/salvar_arquivo', {status: 200})
  });

});


