const {connect} = require("../config/connect");
const users = require("./modalUsers");

async function newClient(data) {
    await connect.sync()
    try {
        let newUser = await users.create({
            tipo: data.tipo,
            nome: data.nome,
            doc: (data.tipo == "PF" ? data.cpf : data.cnpj),
            email: data.email,
            tell: data.telefone
        })

    }catch (err) {console.log("Erro ao registrar novo cliente", err)}finally {
        await connect.close();
    }
}

module.exports = {newClient}