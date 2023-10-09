const Produto = require('../model/produtoModel');
const Categoria = require('../model/categoriaModel');

const { getReqData } = require('../utils/getData');
const { MIME_TYPES, prepareFile } = require('../utils/fileHandler');

const handleGetRequest = async (req, res) => {
    if (req.url === '/produtos') {
        try {
            const produtos = await Produto.buscarTodos();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(produtos));

        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    }
    else if (req.url === '/produtosComACategoria') {
        try {
            const produtos = await Produto.buscarTodosComACategoria();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(produtos));

        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    }
    else if (req.url.match(/^\/produtos\/\d+$/)) {
        try {
            const id = parseInt(req.url.split('/')[2]);
            const produto = await Produto.buscarPorId(id);

            if (isNaN(id)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'ID inválido' }));
                return;
            }

            if (!produto) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Produto não encontrado' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(produto));

        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    } else if (req.url === '/categorias') {
        try {
            const categorias = await Categoria.buscarTodos();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(categorias));

        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    }
    else {
        const file = await prepareFile(req.url);
        const statusCode = file.found ? 200 : 404;
        const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
        res.writeHead(statusCode, { 'Content-Type': mimeType });
        file.stream.pipe(res);
        console.log(`${req.method} ${req.url} ${statusCode}`);
    }
};

const handlePostRequest = async (req, res) => {
    if (req.url === '/produtos') {
        try {
            const data = await getReqData(req);
            const produto = JSON.parse(data);

            if (!produto.nome) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'O campo "nome" é obrigatório' }));
                return;
            }
            const idProduto = await Produto.criar(produto);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id: idProduto }));

        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Rota não encontrada' }));
    }
};

const handleDeleteRequest = async (req, res) => {
    if (req.url.match(/^\/produtos\/\d+$/)) {
        try {
            const id = parseInt(req.url.split('/')[2]);

            if (isNaN(id)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'ID inválido' }));
                return;
            }
            const foiExcluido = await Produto.excluir(id) !== 0;

            if (!foiExcluido) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Produto não encontrado' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Produto excluído com sucesso' }));
            }

        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Rota não encontrada' }));
    }
};

const handlePutRequest = async (req, res) => {
    if (req.url === '/produtos') {
        try {
            const data = await getReqData(req);
            const produto = JSON.parse(data);

            if (isNaN(parseInt(produto.id))) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'ID inválido' }));
                return;
            }

            if (!produto.nome) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'O campo "nome" é obrigatório' }));
                return;
            }
            const foiAtualizado = await Produto.atualizar(produto) !== 0;

            if (!foiAtualizado) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Produto não encontrado' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Produto atualizado com sucesso' }));
            }

        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Rota não encontrada' }));
    }
};

module.exports = {
    handleGetRequest,
    handlePostRequest,
    handleDeleteRequest,
    handlePutRequest
};

