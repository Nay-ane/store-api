const conexao = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const segredo = require('../segredo')

const ERRO_NOME_NAO_INFORMADO = "O campo nome é de preenchimento obrigatorio";
const ERRO_EMAIL_NAO_INFORMADO = "O campo email é de preenchimento obrigatorio";
const ERRO_SENHA_NAO_INFORMADO = "O campo senha é de preenchimento obrigatorio";
const ERRO_NOME_LOJA_NAO_INFORMADO =
    "O campo nome_loja é de preenchimento obrigatorio";
const ERRO_EMAIL_JA_CADASTRADO =
    "O email informado já possui usuário cadastrado";
const ERRO_USUARIO_NAO_CADASTRADO = "Não foi possível cadastrar o usuário";

const cadastrarUsuario = async (req, res) => {
    const novoUsuario = req.body;
    let erro =
        validarBody(novoUsuario) ??
        (await validarEmailExistente(novoUsuario.email));

    if (erro) {
        return res.status(400).json({ mensagem: erro });
    }

    const senhaCriptografada = await bcrypt.hash(novoUsuario.senha, 10);

    try {
        const query =
            "insert into usuarios (nome, email, senha, nome_loja) values ($1, $2, $3, $4)";

        const usuarioCadastrado = await conexao.query(query, [
            novoUsuario.nome,
            novoUsuario.email,
            senhaCriptografada,
            novoUsuario.nome_loja,
        ]);

        console.log(usuarioCadastrado);

        if (usuarioCadastrado.rowCount === 0) {
            return res
                .status(400)
                .json({ message: ERRO_USUARIO_NAO_CADASTRADO });
        }

        return res.status(201).json();
    } catch (error) {
        console.log(error);
        res.status(404).json(error.message);
    }
};



const detalharUsuario = async (req, res) => {
    const id = req.usuarioId

    const query = 'select * from usuarios where id = $1'
    const {rows, rowCount} = await conexao.query(query, [id])

    if(rowCount === 0) {
        return res.status(404).json({mensagem: 'Usuário não encontrado'})
    }

    const {nome, nome_loja, email} = rows[0]

    return res.status(200).json({id, nome, nome_loja, email})
};
   
const atualizarUsuario = async (req, res) => {
  
    
};

function validarBody(body) {
    if (!body.nome) {
        return ERRO_NOME_NAO_INFORMADO;
    }

    if (!body.email) {
        return ERRO_EMAIL_NAO_INFORMADO;
    }

    if (!body.senha) {
        return ERRO_SENHA_NAO_INFORMADO;
    }

    if (!body.nome_loja) {
        return ERRO_NOME_LOJA_NAO_INFORMADO;
    }
}

const validarEmailExistente = async (email) => {
    try {
        const query = "select * from usuarios where email = $1";
        const usuario = await conexao.query(query, [email]);

        if (usuario.rowCount > 0) {
            return ERRO_EMAIL_JA_CADASTRADO;
        }
    } catch (error) {
        return error.message;
    }
};

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
};
