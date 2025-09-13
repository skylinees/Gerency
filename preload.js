const {contextBridge, ipcRenderer} = require("electron");
//const {getAllContas} = require("./database/contas/operationsContas");

contextBridge.exposeInMainWorld("api", { 
  verElectron: () => process.versions.electron,

  //SYNC DATA CLIENTES PELO BANCO DE DADOS
  syncClientsRequest: (data) => ipcRenderer.send("all-clients-request"),
  syncClientsResponse: (data) => ipcRenderer.on("all-clients-response", data),

  //Register Cliente
  newClientRequest: (data) => ipcRenderer.send("new-client-request", data), //Pega os dados do front e joga para back
  newClientResponse: (data) => ipcRenderer.on("new-client-response", data)//Pega o retorno do back e lança pro front
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