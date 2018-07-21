const mysql = require('mysql');
module.exports = class DbConnection {
    constructor() {
        this.conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'acums'
        });
    }

};