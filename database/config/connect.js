const { Sequelize } = require("sequelize");

// Cria a conexão com SQLite
const connect = new Sequelize({
  dialect: "sqlite",
  storage: "./database/paymate.sqlite", // aqui será criado o arquivo do banco
  logging: false, // opcional: desativa logs no console
});

async function initalConnectDb() {
  try {
    await connect.sync({ force: false }); 
    console.log("Conexão inical de com banco de dados realizada!");
  } catch (error) {
    console.error("Erro na conexão inicial com banco de dados", error);
  }
}

module.exports = {connect, initalConnectDb};
