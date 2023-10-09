const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.db');
const { categorias, produtos } = require('./dados');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS categoria (
            id INTEGER PRIMARY KEY, 
            nome VARCHAR (100) NOT NULL
        )`
    );
    db.run(`
        CREATE TABLE IF NOT EXISTS produto (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            nome VARCHAR (150) NOT NULL, 
            descricao VARCHAR (250),
            categoria_id INTEGER,
            FOREIGN KEY (categoria_id) REFERENCES categoria (id)
        )`
    );

    db.get('SELECT COUNT(*) AS totalCategorias FROM categoria', (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        if (row.totalCategorias === 0) {
            categorias.forEach(categoria => {
                db.run('INSERT INTO categoria (id, nome) VALUES (?, ?)', [categoria.id, categoria.nome], (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                });
            });
        }
    });

    db.get('SELECT COUNT(*) AS totalProdutos FROM produto', (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        if (row.totalProdutos === 0) {
            produtos.forEach(produto => {
                db.run('INSERT INTO produto (nome, descricao, categoria_id) VALUES (?, ?, ?)',
                    [produto.nome, produto.descricao, produto.categoria_id], (err) => {
                        if (err) {
                            console.error(err.message);
                        }
                    });
            });
        }
    });
    console.log('BANCO DE DADOS PRONTO!');
});

module.exports = db;
