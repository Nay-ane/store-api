const conexao = require("../conexao");

const ERRO_NOME_PRODUTO_NAO_INFORMADO =
    "O campo nome do produto é de preenchimento obrigatório";
const ERRO_QUANTIDADE_NAO_INFORMADA =
    "O campo quantidade do produto é de preenchimento obrigatório";
const ERRO_QUANTIDADE_PRODUTO =
    "A quantidade disponível do produto deve ser maior que zero";
const ERRO_PRECO_NAO_INFORMADO =
    "O campo preço do produto é de preenchimento obrigatório";
const ERRO_DESCRICAO_NAO_INFORMADA =
    "O campo descrição do produto é de preenchimento obrigatório";
const ERRO_PRODUTO_NAO_CADASTRADO = 
    "Não foi possível cadastrar o produto";
const ERRO_ATUALIZACAO_PRODUTO = "Não foi possível atualizar o produto";
const ERRO_PRODUTO_NAO_ENCONTRADO = "Não foi possível encontrar o produto solicitado"
const ERRO_PRODUTO_NAO_EXCLUIDO = "Não foi possível excluir o produto solicitado"



const listarProdutos = async(req, res) => {
    const usuarioId = req.usuarioId
    try {
        const query = 'select * from produtos where usuario_id = $1'
        const {rows: produtos} = await conexao.query(query, [usuarioId])
        return res.status(200).json(produtos)
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const detalharProduto  = async(req, res) => {
    const idProduto = req.params.id
    const usuarioId = req.usuarioId 

    try {
        const produto = await buscarProdutoPorId(usuarioId, idProduto)

        return res.status(200).json(produto)
        
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const cadastrarProdutos = async (req, res) => {
    const novoProduto = req.body;
    const usuarioId = req.usuarioId;

    try {
        validarBodyProduto(novoProduto);

        const query =
            "insert into produtos (usuario_id, nome, quantidade, categoria, preco, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7)";

        const produtoCadastrado = await conexao.query(query, [
            usuarioId,
            novoProduto.nome,
            novoProduto.quantidade,
            novoProduto.categoria,
            novoProduto.preco,
            novoProduto.descricao,
            novoProduto.imagem,
        ]);

        if ((produtoCadastrado.rowCount = 0)) {
            return res
                .status(400)
                .json({ mensagem: ERRO_PRODUTO_NAO_CADASTRADO });
        }

        return res.status(201).json();
    } catch (error) {
        console.log(error);
        res.status(404).json({ mensagem: error.message });
    }
};


const atualizarProdutos = async(req, res) => {
    const idProduto = req.params.id;
    const usuarioId = req.usuarioId;
    const atualizacaoProduto = req.body;

    try {

        validarBodyProduto(atualizacaoProduto)

        const produto = await buscarProdutoPorId(usuarioId, idProduto)
    
        const query = ` update produtos set 
            nome = $1,
            quantidade = $2,
            categoria = $3,
            preco = $4,
            descricao = $5,
            imagem = $6
            where usuario_id = $7
            and id = $8 `
        ;

        const produtoAtualizado = conexao.query(query, [
            atualizacaoProduto.nome ?? produto.nome,
            atualizacaoProduto.quantidade ?? produto.quantidade,
            atualizacaoProduto.categoria ?? produto.categoria,
            atualizacaoProduto.preco ?? produto.preco,
            atualizacaoProduto.descricao ?? produto.descricao,
            atualizacaoProduto.imagem ?? produto.imagem,
            usuarioId,
            idProduto
        ]);

        if (produtoAtualizado.rowsCount === 0) {
            return res.status(400).json({message: ERRO_ATUALIZACAO_PRODUTO });
        }

        return res.status(200).json()

        
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const excluirProdutos = async(req, res) => {
    const idProduto = req.params.id
    const usuarioId = req.usuarioId

    try {
        await buscarProdutoPorId(usuarioId, idProduto)
        
        const query = `delete from produtos where usuario_id = $1 and id = $2`
        const produtoExcluido = await conexao.query(query, [usuarioId, idProduto])

        if(produtoExcluido.rowCount === 0) {
            return res.status(400).json({ message: ERRO_PRODUTO_NAO_EXCLUIDO })
        }

        return res.status(200).json()
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


function validarBodyProduto(body) {
    if (!body.nome) {
        throw { message: ERRO_NOME_PRODUTO_NAO_INFORMADO };
    }

    if (!body.quantidade) {
        throw { message: ERRO_QUANTIDADE_NAO_INFORMADA };
    }

    if (body.quantidade == undefined) {
        throw { message: ERRO_QUANTIDADE_PRODUTO };
    }

    if (!body.preco) {
        throw { message: ERRO_PRECO_NAO_INFORMADO };
    }

    if (!body.descricao) {
        throw { message: ERRO_DESCRICAO_NAO_INFORMADA };
    }
}

const buscarProdutoPorId = async(usuarioId, idProduto) => {
    const query = 'select * from produtos where usuario_id = $1 and id = $2'
    const {rows, rowCount} = await conexao.query(query, [usuarioId, idProduto])
 
    if(rowCount === 0){
        throw {message: ERRO_PRODUTO_NAO_ENCONTRADO}
    }

    const produto = rows[0]

    return produto
}

module.exports = { 
    cadastrarProdutos, 
    listarProdutos, 
    detalharProduto,
    atualizarProdutos,
    excluirProdutos
};
