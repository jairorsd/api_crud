const db = require("../db");

const buscarCategorias = async (req, res) => {

    db.all("SELECT * FROM categoria", (err, rows) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
            return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ categorias: rows }));
    });
};

module.exports = buscarCategorias;

