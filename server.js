const http = require("http");
const { handleGetRequest, handlePostRequest, handleDeleteRequest, handlePutRequest } = require("./routes/produtos");
const db = require("./db");

const PORT = 8000;

http.createServer(async (req, res) => {
    if (req.method === "GET") {
        await handleGetRequest(req, res);
    } else if (req.method === "POST") {
        await handlePostRequest(req, res);
    } else if (req.method === "DELETE") {
        await handleDeleteRequest(req, res);
    } else if (req.method === "PUT") {
        await handlePutRequest(req, res);
    }

}).listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);


