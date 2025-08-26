const { app, BrowserWindow, screen, Menu, shell, ipcMain } = require('electron')
const path = require("node:path")

//Db Imports
const {initalConnectDb} = require("./database/config/connect")
const {getAllContas} = require("./database/contas/operationsContas")
const {newClient} = require("./database/users/operationsUsers")

const {template} = require("./windowSettings/toolBar")


//Conexão inicial e ciração do banco de dados
initalConnectDb()
/*async function gac() {//query de all users
  (await getAllContas()).forEach(conta => console.log(conta))
}gac();*/

function createMainWindow() {
  // Obtém as dimensões do monitor primário
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  const win = new BrowserWindow({
    x: 0,  // Posição X no canto esquerdo
    y: 0,  // Posição Y no topo
    width,  // Largura igual à área útil do monitor
    height, // Altura igual à área útil do monitor
    icon: './src/public/img/icon-paymate.png', // Adicionar icone,
    maximizable: true,  // Permite maximizar
    fullscreenable: false,  // Desativa o fullscreen tradicional
    autoHideMenuBar: true,  // Opcional: esconde a barra de menu
    webPreferences:{
      preload: path.join(__dirname, "preload.js")
    },
  })
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  win.loadFile('./src/views/index.html')
}

app.whenReady().then(() => {
  createMainWindow()
  ipcMain.on("new-client", (event, data) => {
    async function addClient(data){
      await newClient(data)
    }addClient(data)
  })
})
app.on("window-all-closed", () => {
  if (process.platform !== 'darwin') app.quit()
})