const conexao = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const segredo = require("../segredo");

const ERRO_NOME_NAO_INFORMADO = "O campo nome é de preenchimento obrigatorio";
const ERRO_EMAIL_NAO_INFORMADO = "O campo email é de preenchimento obrigatorio";
const ERRO_SENHA_NAO_INFORMADA = "O campo senha é de preenchimento obrigatorio";
const ERRO_NOME_LOJA_NAO_INFORMADO =
    "O campo nome_loja é de preenchimento obrigatorio";
const ERRO_EMAIL_JA_CADASTRADO =
    "O email informado já possui usuário cadastrado";
const ERRO_USUARIO_NAO_CADASTRADO = "Não foi possível cadastrar o usuário";
const ERRO_USUARIO_NAO_ENCONTRADO = "Usuário não encontrado";
const ERRO_ATUALIZACAO_USUARIO = "Não foi possível cadastrar o usuário";

const cadastrarUsuario = async (req, res) => {
    const novoUsuario = req.body;

    try {
        validarBody(novoUsuario);
        await validarEmailExistente(novoUsuario.email);
        const senhaCriptografada = await bcrypt.hash(novoUsuario.senha, 10);

        const query =
            "insert into usuarios (nome, email, senha, nome_loja) values ($1, $2, $3, $4)";

        const usuarioCadastrado = await conexao.query(query, [
            novoUsuario.nome,
            novoUsuario.email,
            senhaCriptografada,
            novoUsuario.nome_loja,
        ]);

        if (usuarioCadastrado.rowCount === 0) {
            return res
                .status(400)
                .json({ mensagem: ERRO_USUARIO_NAO_CADASTRADO });
        }

        return res.status(201).json();
    } catch (error) {
        res.status(404).json({ mensagem: error.message });
    }
};

const detalharUsuario = async (req, res) => {
    const id = req.usuarioId;

    try {
        const usuario = await buscarUsuarioPorId(id);
        const { nome, email, nome_loja } = usuario;
        return res.status(200).json({ id, nome, email, nome_loja });
    } catch (error) {
        res.status(400).json({ mensagem: error.message });
    }
};

const atualizarUsuario = async (req, res) => {
    const id = req.usuarioId;
    const atualizacaoUsuario = req.body;
    const senhaCriptografada = await bcrypt.hash(atualizacaoUsuario.senha, 10);

    try {
        validarBody(atualizacaoUsuario);
        const usuario = await buscarUsuarioPorId(id);

        if (atualizacaoUsuario.email !== usuario.email) {
            validarEmailExistente(atualizacaoUsuario.email);
        }

        const query = ` update usuarios set 
            nome = $1,
            email = $2,
            senha = $3,
            nome_loja = $4,
            where id = $5 `;
        const usuarioAtualizado = conexao.query(query, [
            atualizacaoUsuario.nome,
            atualizacaoUsuario.email,
            senhaCriptografada,
            atualizacaoUsuario.nome_loja,
            id,
        ]);

        if (usuarioAtualizado.rowsCount === 0) {
            return res.status(404).json({ mensagem: ERRO_ATUALIZACAO_USUARIO });
        }

        return res.status(200).json();
    } catch (error) {
        res.status(400).json({ mensagem: error.message });
    }
};

function validarBody(body) {
    if (!body.nome) {
        throw { message: ERRO_NOME_NAO_INFORMADO };
    }

    if (!body.email) {
        throw { message: ERRO_EMAIL_NAO_INFORMADO };
    }

    if (!body.senha) {
        throw { message: ERRO_SENHA_NAO_INFORMADA };
    }

    if (!body.nome_loja) {
        throw { message: ERRO_NOME_LOJA_NAO_INFORMADO };
    }
}

const validarEmailExistente = async (email) => {
    const query = "select * from usuarios where email = $1";
    const usuario = await conexao.query(query, [email]);

    if (usuario.rowCount > 0) {
        throw { mensagem: ERRO_EMAIL_JA_CADASTRADO };
    }
};

const buscarUsuarioPorId = async (id) => {
    const query = `select * from usuarios where id = $1`;
    const { rows, rowCount } = await conexao.query(query, [id]);

    if (rowCount === 0) {
        throw { mensagem: ERRO_USUARIO_NAO_ENCONTRADO };
    }

    const usuario = rows[0];

    return usuario;
};

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario,
};
