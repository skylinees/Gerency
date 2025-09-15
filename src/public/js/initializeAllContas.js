var allContas;

async function gac() {
   await api.syncDebtsRequest()
   await api.syncDebtsResponse((_, data) => console.log(data))

}gac()