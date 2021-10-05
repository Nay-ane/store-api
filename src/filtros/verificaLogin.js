const jwt = require("jsonwebtoken");
const segredo = require("../segredo");

const verificaLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res
            .status(401)
            .json({
                mensagem:
                    "Para acessar este recurso um token de autenticação válido deve ser enviado.",
            });
    }

    try {
        const token = authorization.replace("Bearer", "").trim();
        const { id } = jwt.verify(token, segredo);

        req.usuarioId = id;

        next();
    } catch (error) {
        return res
            .status(403)
            .json({
                mensagem:
                    "O usuário não tem permissão de acessar o recurso solicitado",
            });
    }
};

module.exports = { verificaLogin };
