var mysql = require('mysql');
var DbConnection = require('../general/dbconn');
module.exports = (app) => {
    app.get('/users', (req, res) => {
        try {
            let db_conn = new DbConnection();
            db_conn.conn.query('select * from user_tbl where userType!=\'SUPER_ADMIN\' order by userId desc', (err, result) => {
                if (Object.keys(result).length > 0) {
                    res.render('users', {
                        request: req,
                        gridData: result
                    });
                } else
                    res.render('users', {
                        request: req,
                        gridData: []
                    });
            });
            db_conn.conn.end();
        } catch (Error) {
            throw Error;
        }
    });
    app.get('/user/:id', (req, res) => {
        try {
            let db_conn = new DbConnection();
            db_conn.conn.query('select * from user_tbl where userId=?', [req.params.id], (err, result) => {
                res.render('changePassword', {
                    request: req,
                    userInfo: result[0]
                });
            });
            db_conn.conn.end();
        } catch (Error) {
            throw Error;
        }
    });    
    app.post('/users', (req, res) => {
        try {
            var info = trimObj(req.body);
            let db_conn = new DbConnection();
            if (info.userId == 0) {
                db_conn.conn.query('insert into user_tbl(companyId,fullName,email,mobile,userType,userName,password,isActive)values(?,?,?,?,?,?,?,?)', [req.session.__companyId, info.fullName, info.email, info.mobile, info.userType, info.userName, info.password, info.isActive], (err, result) => {
                    if(err)throw err;
                });
                db_conn.conn.end();
            } else if (info.userId > 0) {
                db_conn.conn.query('update user_tbl set companyId=?,fullName=?,email=?, mobile=?, userType=?, userName=?, password=?, isActive=? where userId=?', [req.session.__companyId, info.fullName, info.email, info.mobile, info.userType, info.userName, info.password, info.isActive, info.userId], (err, result) => {
                    if (err) throw err;
                });
                db_conn.conn.end();
            }
            res.json('success');
        } catch (Error) {
            throw Error;
        }
    });
    app.post('/userViewById', (req, res) => {
        try {
            var info = trimObj(req.body);
            let db_conn = new DbConnection();
            db_conn.conn.query('select * from user_tbl where userId=?', [info.userId], (err, result) => {
                if (err) throw err;
                if (Object.keys(result).length > 0) {
                    res.send(result[0]);
                }
            });
            db_conn.conn.end();
        } catch (Error) {
            console.log(Error);
        }
    });

    app.post('/userDeleteById', (req, res) => {
        try {
            var info = trimObj(req.body);
            let db_conn = new DbConnection();
            db_conn.conn.query('delete from user_tbl where userId=?', [info.userId], (err, result) => {
                if (err) throw err;
                res.json('deleted');
            });
            db_conn.conn.end();
        } catch (Error) {
            throw Error;
        }
    });

    function trimObj(obj) {
        if (!Array.isArray(obj) && typeof obj != 'object') return obj;
        return Object.keys(obj).reduce(function (acc, key) {
            acc[key.trim()] = typeof obj[key] == 'string' ? obj[key].trim() : trimObj(obj[key]);
            return acc;
        }, Array.isArray(obj) ? [] : {});
    }
};