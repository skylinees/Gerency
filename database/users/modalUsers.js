const { DataTypes } = require("sequelize");
const {connect} = require("../config/connect");

// Definindo modelo User
const Users = connect.define("users", {
    tipo: {
        type: DataTypes.ENUM('PF','PJ'),
        allowNull: false,
        defaultValue: "PF"
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