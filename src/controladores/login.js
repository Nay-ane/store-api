const conexao = require("../conexao");
const segredo = require('../segredo');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const ERRO_EMAIL_OU_SENHA_NAO_INFORMADO = "O email e senha são obrigatórios";
const ERRO_USUARIO_NAO_ENCONTRADO = "O usuário não foi encontrado";
const ERRO_EMAIL_SENHA_NAO_CONFERE = "Email e senha não conferem";

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        verificarBody(email, senha);
        const token = await validarInformacoes(email, senha);
        return res.status(200).json({token});
    } catch (error) {
        return res.status(401).json({ mensagem: error.message });
    }
};

function verificarBody(email, senha) {
    if (!email || !senha) {
        throw { message: ERRO_EMAIL_OU_SENHA_NAO_INFORMADO };
    }
}

const validarInformacoes = async (email, senha) => {
    const usuario = await buscaUsuarioPorEmail(email);

    const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

    if (!senhaVerificada) {
        throw { message: ERRO_EMAIL_SENHA_NAO_CONFERE };
    }

    const token = jwt.sign({ id: usuario.id }, segredo , {expiresIn: '8h'});

    return token
};

const buscaUsuarioPorEmail = async (email) => {
    const query = "select * from usuarios where email = $1";
    const { rows, rowCount } = await conexao.query(query, [email]);

    if (rowCount === 0) {
        throw { message: ERRO_USUARIO_NAO_ENCONTRADO };
    }

    return rows[0];
};

module.exports = {
    login,
};
