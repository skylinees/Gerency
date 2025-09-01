const Contas = require("./modelContas");

async function getAllContas() {
  let allContas = [];
  try{
    allContas = await Contas.findAll();//Query de todos os registros
  }catch(err){
    console.log("Erro a obeter todos os registros de Contas", err) //Tratamento de erro caso a query não execute
  }
  console.log(allContas)
  return allContas;
}
module.exports = {getAllContas}