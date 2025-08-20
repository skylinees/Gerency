const {contextBridge} = require("electron");
const {getAllContas} = require("./database/contas/operationsContas");


contextBridge.exposeInMainWorld("api", { 
  verElectron: () => process.versions.electron,
  allContas: async () => getAllContas()
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