const path = require('path');
const fs = require('fs');

// Código para servir arquivos estáticos de dentro da pasta static
// Peguei esse código do site https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
const MIME_TYPES = {
    default: 'application/octet-stream',
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
};

const STATIC_PATH = path.join(process.cwd(), './static');

const prepareFile = async (url) => {
    const temParametros = url.match(/\/edita\.html\?id=(\d+)&nome=[^&]+(?:&descricao=[^&]+)?(?:&categoria_id=\d*)?$/);

    const paths = [STATIC_PATH, temParametros ? '/' : url];
    if (url.endsWith('/')) paths.push('index.html');
    if (temParametros) paths.push('edita.html');
    const filePath = path.join(...paths);
    const pathTraversal = !filePath.startsWith(STATIC_PATH);
    const exists = await fs.promises.access(filePath).then(() => true, () => false);
    const found = !pathTraversal && exists && !url.endsWith('edita.html');
    const streamPath = found ? filePath : STATIC_PATH + '/404.html';
    const ext = path.extname(streamPath).substring(1).toLowerCase();
    const stream = fs.createReadStream(streamPath);
    return { found, ext, stream };
};

module.exports = {
    MIME_TYPES,
    prepareFile
};