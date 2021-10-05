const express = require("express");

const {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario,
} = require("./controladores/usuarios");

const { login } = require("./controladores/login");

const { verificaLogin } = require("./filtros/verificaLogin");

const rotas = express();

//rotas-usuarios

rotas.post("/usuario", cadastrarUsuario);
rotas.get("/usuario",verificaLogin, detalharUsuario,);
rotas.put("/usuario/:id",verificaLogin, atualizarUsuario);

rotas.post("/login", login);

module.exports = rotas;
