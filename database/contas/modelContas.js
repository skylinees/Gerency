const { DataTypes } = require("sequelize");
const {connect} = require("../config/connect");

// Definindo modelo User
const Contas = connect.define("contas", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  venc: {
    type: DataTypes.DATE,
    allowNull: false
  },
  valor: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pendente','vencido','pago'),
    allowNull: false,
    defaultValue: 'pendente'
  }
});

module.exports = Contas;
