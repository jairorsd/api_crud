const url = require("url");
const db = require("../db");
const { getReqData } = require("../utils");

const buscarProdutos = async (req, res) => {
    const sql = "SELECT A.ID AS id, " +
        "A.NOME AS nome, " +
        "A.DESCRICAO AS descricao, " +
        "C.NOME AS categoria " +
        "FROM produto A " +
        "LEFT JOIN categoria C ON A.CATEGORIA_ID = C.ID";

    db.all(sql, (err, rows) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
            return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ produtos: rows }));
    });
};

const criarProduto = async (req, res) => {
    const data = await getReqData(req);

    const { nome, descricao, categoria } = JSON.parse(data);

    if (!nome) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "O campo \"nome\" é obrigatório" }));
        return;
    }
    db.run("INSERT INTO produto (nome, descricao, categoria_id) VALUES (?, ?, ?)", [nome, descricao, categoria],
        function (err) {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: err.message }));
                return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ id: this.lastID }));
        });
};

const buscarProdutoPeloId = async (req, res) => {
    const id = parseInt(req.url.split("/")[2]);

    if (isNaN(id)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "ID inválido" }));
        return;
    }

    const sql = "SELECT A.ID AS id, " +
        "A.NOME AS nome, " +
        "A.DESCRICAO AS descricao, " +
        "C.NOME AS categoria " +
        "FROM produto A " +
        "LEFT JOIN categoria C ON A.CATEGORIA_ID = C.ID " +
        "WHERE A.ID = ?";

    db.get(sql, [id], (err, row) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
            return;
        }

        if (!row) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Produto não encontrado" }));
            return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ produto: row }));
    });
};

const buscarProdutoPeloNome = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const nome = parsedUrl.query["nome"];

    const sql = "SELECT A.ID AS id, " +
        "A.NOME AS nome, " +
        "A.DESCRICAO AS descricao, " +
        "C.NOME AS categoria " +
        "FROM produto A " +
        "LEFT JOIN categoria C ON A.CATEGORIA_ID = C.ID " +
        "WHERE A.NOME LIKE ?";

    db.all(sql, [nome + "%"], (err, row) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
            return;
        }

        if (row.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Produto não encontrado" }));
            return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ produtos: row }));
    });
};

const buscarSomenteProdutosComCategoria = async (req, res) => {
    const sql = "SELECT A.ID AS id, " +
        "A.NOME AS nome, " +
        "A.DESCRICAO AS descricao, " +
        "C.NOME AS categoria " +
        "FROM produto A " +
        "INNER JOIN categoria C ON A.CATEGORIA_ID = C.ID";

    db.all(sql, (err, rows) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
            return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ produtos: rows }));
    });
};

const excluirProduto = async (req, res) => {
    const id = parseInt(req.url.split("/")[2]);

    if (isNaN(id)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "ID inválido" }));
        return;
    }

    db.run("DELETE FROM produto WHERE id = ?", [id], function (err) {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
            return;
        }

        if (this.changes === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Produto não encontrado" }));
            return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Produto excluído com sucesso" }));
    });
};

const atualizarProduto = async (req, res) => {
    const data = await getReqData(req);

    const { id, nome, descricao, categoria } = JSON.parse(data);

    if (isNaN(parseInt(id))) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "ID inválido" }));
        return;
    }

    if (!nome) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify(({ error: "O campo \"nome\" é obrigatório" })));
        return;
    }

    db.run("UPDATE produto SET nome = ?, descricao = ?, categoria_id = ? WHERE id = ?",
        [nome, descricao, categoria, id],
        function (err) {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: err.message }));
                return;
            }

            if (this.changes === 0) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Produto não encontrado" }));
                return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Produto atualizado com sucesso" }));
        });
};

module.exports = {
    buscarProdutos,
    buscarProdutoPeloId,
    buscarProdutoPeloNome,
    buscarSomenteProdutosComCategoria,
    criarProduto,
    excluirProduto,
    atualizarProduto,
};