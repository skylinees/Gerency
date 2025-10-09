////////////////////////////////////////
const { Model } = require("sequelize");
const Users = require("./database/users/modalUsers");

async function insert20Users() {
  try {
    const users = [
      { tipo: "PF", nome: "Carlos Silva", doc: "12345678901", email: "carlos.silva@example.com", tell: "11987654321" },
      { tipo: "PF", nome: "Mariana Oliveira", doc: "23456789012", email: "mariana.oliveira@example.com", tell: "21987654322" },
      { tipo: "PF", nome: "João Pereira", doc: "34567890123", email: "joao.pereira@example.com", tell: "31987654323" },
      { tipo: "PJ", nome: "TechVision Ltda", doc: "12345678000199", email: "contato@techvision.com", tell: "11999998888" },
      { tipo: "PF", nome: "Luciana Rocha", doc: "45678901234", email: "luciana.rocha@example.com", tell: "41987654324" },
      { tipo: "PJ", nome: "Skyline Solutions", doc: "23456789000112", email: "admin@skyline.com", tell: "11988887777" },
      { tipo: "PF", nome: "Rafael Costa", doc: "56789012345", email: "rafael.costa@example.com", tell: "51987654325" },
      { tipo: "PF", nome: "Beatriz Santos", doc: "67890123456", email: "beatriz.santos@example.com", tell: "61987654326" },
      { tipo: "PJ", nome: "NextGen Systems", doc: "34567890000145", email: "info@nextgen.com", tell: "21999990000" },
      { tipo: "PF", nome: "Fernando Almeida", doc: "78901234567", email: "fernando.almeida@example.com", tell: "71987654327" },
      { tipo: "PJ", nome: "NovaEra Tech", doc: "98765432000111", email: "contato@novaeratech.com", tell: "11988889999" },
      { tipo: "PF", nome: "Patrícia Lima", doc: "89012345678", email: "patricia.lima@example.com", tell: "81987654328" },
      { tipo: "PF", nome: "Eduardo Martins", doc: "90123456789", email: "eduardo.martins@example.com", tell: "11987654329" },
      { tipo: "PJ", nome: "GreenField Corp", doc: "55544433000188", email: "financeiro@greenfield.com", tell: "11977776666" },
      { tipo: "PF", nome: "Amanda Ferreira", doc: "11223344556", email: "amanda.ferreira@example.com", tell: "11987654330" },
      { tipo: "PF", nome: "Rodrigo Souza", doc: "22334455667", email: "rodrigo.souza@example.com", tell: "11987654331" },
      { tipo: "PJ", nome: "BlueOcean Ltda", doc: "99887766000144", email: "suporte@blueocean.com", tell: "11999992222" },
      { tipo: "PF", nome: "Juliana Castro", doc: "33445566778", email: "juliana.castro@example.com", tell: "11987654332" },
      { tipo: "PF", nome: "Thiago Ribeiro", doc: "44556677889", email: "thiago.ribeiro@example.com", tell: "11987654333" },
      { tipo: "PJ", nome: "VisionEdge Corp", doc: "77665544000122", email: "contact@visionedge.com", tell: "11955554444" },
    ];

    await Users.bulkCreate(users);
    console.log("✅ 20 usuários diferentes adicionados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao adicionar usuários:", error);
  }
}

// executa
module.exports = {insert20Users}


//////////////////////////////////////////