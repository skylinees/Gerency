const users = require("./modalUsers");

async function formatDataClients (clients){
    let formatedData = []
    clients.forEach(user => {
        //console.log(user.dataValues);
        formatedData.push(user.dataValues)
    });
    console.log('---------------------',formatedData);
    return formatedData;
}

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
        console.log("buscando clientes")
        let allUsers = await users.findAll();
       return await formatDataClients(allUsers)
    }catch(err){console.log("Erro ao consultar clientes: ", err); return "err"}
}

module.exports = {newClient, getAllClientes}