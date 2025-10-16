//DEV SETTINGS
////////////
//const {insert20Users} =  require("./dev")
//////////

const { app, BrowserWindow, screen, Menu, shell, ipcMain } = require('electron')
const path = require("node:path")

//Db Imports
const {initalConnectDb} = require("./database/config/connect")
const {getAllContas} = require("./database/contas/operationsContas")
const {
  newClient, getClientsPagination, 
  getInforTableClients, getClientByName,
  deleteClient, editClient
} = require("./database/users/operationsUsers")

const {template} = require("./windowSettings/toolBar")

//Conexão inicial e ciração do banco de dados
initalConnectDb()

//DEV SETTINGS
////////
//insert20Users()
///////

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

  //REGISTRAR CLIENTES
  ipcMain.on("new-client-request", (event, data) => {
    console.log("REGISTRANDO CLIENTE")
    newClient(data)
      .then(userInDb => {
        let client = userInDb.dataValues
        event.reply("new-client-response", client)
      })
      .catch(err => console.log("Erro ao registrar cliente", err))
  })

  //Get all contas no banco
  ipcMain.on("all-debts-request", (event)=>{
    console.log("Solicitando contas ao banco de dados")
    getAllContas()
        .then(contas => event.reply("all-debts-response", contas))
        .catch(err => console.log("Erro ao solicitar todas contas", err))
  })

  // GET ALL CLIENTES
  ipcMain.on("pagination-clients-request", (event, data)=>{
    getClientsPagination(data)
      .then(response => event.reply("pagination-clients-response", response))
      .catch(err => console.log("Erro ao consultar clientes paginados", err))
  })

  //Get de table
  ipcMain.on("get-infor-table-request", (event, data)=>{
    switch(data){
      case "clients":
        getInforTableClients()
          .then(data => event.reply("get-infor-table-response",data))
          .catch(err => console.log("Erro a solictar informações de paginação", err))
      break;
      case "contas":
        console.log("table infor contas")
      break;
    }
  })

  //Search client by name
  ipcMain.on("search-clients-by-name-request", (event, data)=>{
    getClientByName(data)
      .then(clients => {console.log("DEBBUGER---",data) ; event.reply("search-clients-by-name-reponse", clients)})
      .catch(err => console.log("Erro a buscar cliente por nome", err))
  })

  ipcMain.on("delete-clients-request", (event, data)=>{
    deleteClient(data)
      .then(response => event.reply("delete-clients-reponse", response))
      .catch(err => console.log("Erro ao deletar cliente...", err))
  })

  ipcMain.on("edit-clients-request", (event, data)=>{
    editClient(data)
      .then(response =>{event.reply("edit-clients-reponse", data)})
      .catch(e => {console.log("ERRO AO EDITAR CLIENTE"); event.reply("edit-clients-reponse", true)})
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== 'darwin') app.quit()
})