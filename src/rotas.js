const express = require("express");

const {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario,
} = require("./controladores/usuarios");

const {
    cadastrarProdutos, 
    listarProdutos, 
    detalharProduto,
    atualizarProdutos,
    excluirProdutos
} = require('./controladores/produtos')

const { login } = require("./controladores/login");

const { verificaLogin } = require("./filtros/verificaLogin");

const rotas = express();

//rotas-usuarios

rotas.post("/usuario", cadastrarUsuario);
rotas.get("/usuario",verificaLogin, detalharUsuario,);
rotas.put("/usuario",verificaLogin, atualizarUsuario);

//rota-login
rotas.post("/login", login);

//rotas-produtos
rotas.get("/produtos", verificaLogin, listarProdutos)
rotas.get("/produtos/:id", verificaLogin, detalharProduto)
rotas.post("/produtos", verificaLogin, cadastrarProdutos)
rotas.put("/produtos/:id", verificaLogin, atualizarProdutos)
rotas.delete("/produtos/:id", verificaLogin, excluirProdutos)


module.exports = rotas;
