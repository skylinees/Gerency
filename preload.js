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
  newClientRequest: (data) => ipcRenderer.send("new-client-request", data), //Pega os dados do front e joga para back
  newClientResponse: (data) => ipcRenderer.on("new-client-response", data),//Pega o retorno do back e lança pro front

  //Get de if tables
  getInforTableRequest: (data) => ipcRenderer.send("get-infor-table-request", data), //Pega os dados do front e joga para back
  getInforTableResponse: (data) => ipcRenderer.on("get-infor-table-response", data),//Pega o retorno do back e lança pro front

  //Get de clientes por nonme
  searchClientByNameRequest:  (data) => ipcRenderer.send("search-clients-by-name-request", data),
  searchClientByNameResponse:  (data) => ipcRenderer.on("search-clients-by-name-reponse", data)

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