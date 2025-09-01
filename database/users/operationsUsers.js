const users = require("./modalUsers");

async function newClient(data){
    try {
        const newUser = await users.create({
            tipo: data.tipo,
            nome: data.nome,
            doc: (data.tipo == 'PF' ? data.cpf : data.cnpj),
            email: data.email,
            tell: data.telefone
        })
        console.log("Cliente registrado com sucesso")
        return await newUser;
    }catch (err) {console.log("Erro ao registrar novo cliente", err); return "err"}
}

async function getAllClientes() {
    try{
       return await users.findAll();
    }catch(err){console.log("Erro ao consultar clientes: ", err); return "err"}
}

module.exports = {newClient, getAllClientes}