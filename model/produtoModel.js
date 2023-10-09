const db = require('../db');

class Produto {

    static async buscarTodos() {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT * FROM produto`, (error, rows) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async buscarTodosComACategoria() {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT A.ID AS id,
                    A.NOME AS nome,
                    A.DESCRICAO AS descricao,
                    C.NOME AS categoria
                FROM produto A
                LEFT JOIN categoria C ON A.CATEGORIA_ID = C.ID
            `, (error, rows) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async buscarPorId(id) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT A.ID AS id,
                    A.NOME AS nome,
                    A.DESCRICAO AS descricao,
                    C.NOME AS categoria
                FROM produto A
                LEFT JOIN categoria C ON A.CATEGORIA_ID = C.ID
                WHERE A.ID = ?`,
                [id],
                (error, row) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(row);
                    }
                }
            );
        });
    }

    static async criar(produto) {
        return new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO produto (nome, descricao, categoria_id) VALUES (?, ?, ?)`,
                [produto.nome, produto.descricao, produto.categoria],
                function (error) {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        });
    }

    static async atualizar(produto) {
        return new Promise((resolve, reject) => {
            db.run(`
                UPDATE produto SET
                    nome = ?, 
                    descricao = ?, 
                    categoria_id = ? 
                WHERE id = ?`,
                [produto.nome, produto.descricao, produto.categoria, produto.id],
                
                function (error) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(this.changes);
                    }
                }
            );
        });
    }

    static async excluir(id) {
        return new Promise((resolve, reject) => {
            db.run(`
                DELETE FROM produto WHERE id = ?`,
                [id],
                function (error) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(this.changes);
                    }
                }
            );
        });
    }
};

module.exports = Produto;
