const { app, BrowserWindow, screen, Menu, shell, ipcMain } = require('electron')
const path = require("node:path")

//Db Imports
const {initalConnectDb} = require("./database/config/connect")
const {getAllContas} = require("./database/contas/operationsContas")
const {newClient, getAllClientes} = require("./database/users/operationsUsers")

const {template} = require("./windowSettings/toolBar")


//Conexão inicial e ciração do banco de dados
initalConnectDb()

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
  win.loadFile('./src/views/clientes.html')
}

app.whenReady().then(() => {
  createMainWindow()
  ipcMain.on("new-client-request", (event, data) => {
    console.log("REGISTRANDO CLIENTE")
    newClient(data)
      .then(userInDb => {
        let client = userInDb.dataValues
        event.reply("new-client-response", client)
      })
      .catch(err => console.log("Erro ao registrar cliente", err))
  })

  ipcMain.on("all-clients-request", (event, data)=>{
    console.log("Solicitando clientes ao banco de dados")
    getAllClientes()
      .then(clients => {
        getAllClientes()
          .then(clients => event.reply("all-clients-response", clients))
          .catch(err => console.log("erro ao solicitar todos clientes", err))
      })
      .catch(err => console.log("Erro ao buscar todos os clientes", err))
  })
})
app.on("window-all-closed", () => {
  if (process.platform !== 'darwin') app.quit()
})