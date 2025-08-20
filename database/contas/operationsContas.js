const {connect} = require("../config/connect")
const Contas = require("./modelContas");

async function getAllContas() {
  await connect.sync()//Garante sincronização com o banco E CONEXÃO
  let allContas = [];
  try{
    allContas = await Contas.findAll();//Query de todos os registros
  }catch(err){
    console.log("Erro a obeter todos os registros de Contas", err) //Tratamento de erro caso a query não execute
  }finally{
    await connect.close()// 
  }
  console.log(allContas)
  return allContas;
}
module.exports = {getAllContas}