const jwt = require('jsonwebtoken');
const segredo = require('../segredo')
const conexao = require('../conexao')

const verificaLogin = async(req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization) {
        return res.status(404).json('Token não informado')
    }

    try {
        const token = authorization.replace('Bearer', '').trim()
        const {id} = jwt.verify(token, segredo)

        req.usuarioId = id

        next()
    } catch (error) {
        return res.status(404).json('Token não informado')
    }
}

module.exports = {verificaLogin}