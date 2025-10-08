const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("api", { 
  verElectron: () => process.versions.electron,

  // SYNC CONTAS PELO BANCO DE DADOS
  syncDebtsRequest: () => ipcRenderer.send("all-debts-request"),
  syncDebtsResponse: (data) => ipcRenderer.on("all-debts-response", data),

  //SYNC DATA CLIENTS FOR PARGINATION 1O ITENS
  syncClientsPgRequest: (data) => ipcRenderer.send("pagination-clients-request", data),
  syncClientsPgResponse: (data) => ipcRenderer.on("pagination-clients-response",data),

  //Register Cliente
  newClientRequest: (data) => ipcRenderer.send("new-client-request", data),
  newClientResponse: (data) => ipcRenderer.on("new-client-response", data),

  //Get de if tables
  getInforTableRequest: (data) => ipcRenderer.send("get-infor-table-request", data),
  getInforTableResponse: (data) => ipcRenderer.on("get-infor-table-response", data),

  //Get de clientes por nonme
  searchClientByNameRequest:  (data) => ipcRenderer.send("search-clients-by-name-request", data),
  searchClientByNameResponse:  (data) => ipcRenderer.on("search-clients-by-name-reponse", data),

  //Exluir clientes
  deleteClientRequest:  (data) => ipcRenderer.send("delete-clients-request", data),
  deleteClientResponse:  (data) => ipcRenderer.on("delete-clients-reponse", data),
  
  //Editar clientes com base no id
  editClientRequest:  (data) => ipcRenderer.send("edit-clients-request", data),
  editClientResponse:  (data) => ipcRenderer.on("edit-clients-reponse", data)
})

window.addEventListener("DOMContentLoaded", () => {
  const data = document.getElementById("data-atual").innerHTML = getData();
})

function getData(){
  const data = new Date()
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }
  return data.toLocaleDateString("pt-BR", options)
}