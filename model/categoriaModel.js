const db = require('../db');

class Categoria {

    static async buscarTodos() {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT * FROM categoria`, (error, rows) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = Categoria;