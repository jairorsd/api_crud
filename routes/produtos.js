const path = require("path");
const fs = require("fs");
const {
    buscarProdutos,
    buscarProdutoPeloId,
    buscarProdutoPeloNome,
    buscarSomenteProdutosComCategoria,
    criarProduto,
    excluirProduto,
    atualizarProduto
} = require("../controller/ProdutoController");

const buscarCategorias = require("../controller/CategoriaController");

const MIME_TYPES = {
    default: "application/octet-stream",
    html: "text/html; charset=UTF-8",
    js: "application/javascript",
    css: "text/css",
    png: "image/png",
    jpg: "image/jpg",
    gif: "image/gif",
    ico: "image/x-icon",
    svg: "image/svg+xml",
};

const STATIC_PATH = path.join(process.cwd(), "./static");

const prepareFile = async (url) => {
    const hasParameters = url.match(/\/edita\.html\?id=(\d+)(?:&nome=[^&]+)?(?:&descricao=[^&]+)?(?:&categoria=[^&]*)?$/);

    const paths = [STATIC_PATH, hasParameters ? "/" : url];
    if (url.endsWith("/")) paths.push("index.html");
    if (hasParameters) paths.push("edita.html");
    const filePath = path.join(...paths);
    const pathTraversal = !filePath.startsWith(STATIC_PATH);
    const exists = await fs.promises.access(filePath).then(() => true, () => false); 
    const found = !pathTraversal && exists && !url.endsWith("edita.html");
    const streamPath = found ? filePath : STATIC_PATH + "/404.html";
    const ext = path.extname(streamPath).substring(1).toLowerCase();
    const stream = fs.createReadStream(streamPath);
    return { found, ext, stream };
};

const handleGetRequest = async (req, res) => {
    if (req.url === "/produtos") {
        await buscarProdutos(req, res);
    }
    else if (req.url.match(/^\/produtos\/\d+$/)) {
        await buscarProdutoPeloId(req, res);
    }
    else if (req.url.match(/^\/produtos\?nome=[^&]+$/)) {
        await buscarProdutoPeloNome(req, res);
    }
    else if (req.url === "/produtosComCategoria") {
        await buscarSomenteProdutosComCategoria(req, res);
    }
    else if (req.url === "/categorias") {
        await buscarCategorias(req, res);
    }
    else {
        defaultHandleRequest(req, res);
    }
};

const defaultHandleRequest = async (req, res) => {
    const file = await prepareFile(req.url);
    const statusCode = file.found ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(statusCode, { "Content-Type": mimeType });
    file.stream.pipe(res);
    console.log(`${req.method} ${req.url} ${statusCode}`);
};

const handlePostRequest = async (req, res) => {
    if (req.url === "/produtos") {
        await criarProduto(req, res);
    } else {
        await defaultHandleRequest(req, res);
    }
};

const handleDeleteRequest = async (req, res) => {
    if (req.url.match(/^\/produtos\/\d+$/)) {
        await excluirProduto(req, res);
    } else {
        await defaultHandleRequest(req, res);
    }
};

const handlePutRequest = async (req, res) => {
    if (req.url === "/produtos") {
        await atualizarProduto(req, res);
    } else {
        await defaultHandleRequest(req, res);
    }
};

module.exports = {
    handleGetRequest,
    handlePostRequest,
    handleDeleteRequest,
    handlePutRequest
};

