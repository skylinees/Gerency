const { DataTypes } = require("sequelize");
const {connect} = require("../config/connect");

// Definindo modelo User
const Users = connect.define("contas", {
    tipo: {
        type: DataTypes.ENUM('PF','PJ'),
        allowNull: false,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    doc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tell: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Users;