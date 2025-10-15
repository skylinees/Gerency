const users = require("./modalUsers");
const {Op} = require("sequelize") 
const {bakcupDB} = require("../backup")

async function formatDataClients (clients){
    let formatedData = []
    clients.forEach(user => {
        //console.log(user.dataValues);
        formatedData.push(user.dataValues)
    });
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

async function getClientsPagination(page) {
    console.log("Consultando clientes da pagina ", page)
    try{
        const itensForPage = 10
        const offSet = (page - 1)  * itensForPage
        const {count, rows} = await users.findAndCountAll({
            limit: itensForPage,
            offset: offSet
        })
       return await {
        totalRegisters: count,
        totalPages: Math.ceil(count/ itensForPage),
        currentPage: page,
        registers: await formatDataClients(rows)
       }
    }catch(err){console.log("Erro ao consultar clientes: ", err); return "err"}
}

async function getInforTableClients() {
     console.log("Consultado Informaçãos da paginação de clientes ")
    try{
        const itensForPage = 10
        const {count} = await users.findAndCountAll()
       return await {
        totalRegisters: count,
        totalPages: Math.ceil(count/ itensForPage)
       }
    }catch(err){console.log("Erro ao consultar informação da paginação de clientes: ", err); return "err"}
}

async function getClientByName(data) {
    let clients;
    try{
        clients = await users.findAll({
            where:{
                nome:{
                    [Op.like] : `${data}%`
                }
            }
        })
    }catch(e){console.log("Erro a consultar cliente por")}
    console.log("RESULTADO DA GET POR NOME", clients)
    return await formatDataClients(clients)
}

async function deleteClient(id) {
    bakcupDB();
    try{
        return result = await users.destroy({
            where: {
                id: id
            }
        })
    }catch(e){console.log("Erro a exluir cliente...", e); return e}
}

async function editClient(data) {
    console.log("PROCESSO DE RENDERIZAÇÃO DBHANDLER -ENTRADA-...")

    console.log("PROCESSO DE RENDERIZAÇÃO DBHANDLER -SAIDA-...")
}

module.exports = {
    newClient, getClientsPagination, 
    getInforTableClients, getClientByName,
    deleteClient, editClient
}