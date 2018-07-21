var mysql = require('mysql');
var DbConnection = require('../general/dbconn');
module.exports = (app) => {
    app.get('/login', (req, res, next) => {
        // req.session.destroy();
        console.log('LOGIN_GET');
        res.render('login');
        res.end();
    });
    app.post('/login', (req, res, next) => {
        try {
            console.log("LOGIN_POST");
            userName = req.body.userName;
            password = req.body.password;

            let db_conn = new DbConnection();
            db_conn.conn.query('select * from user_tbl where userName="' + userName + '" and password="' + password + '"', (err, result, fields) => {
                if (err) throw err;
                if (Object.keys(result).length > 0) {
                    Object.keys(result).forEach((key) => {
                        var row = result[key];
                        req.session.__userId = row.userId;
                        req.session.save((err) => {
                            console.log("LOGGED");
                            // req.url = "/dashboard";
                            res.redirect('/dashboard');
                            // next();
                        });
                    });
                }
            });
            db_conn.conn.end();
        } catch (Error) {
            console.error("ERROR_OCCURED");
            // res.render('/login');
        }
    });
};