var mysql = require('mysql');
var DbConnection = require('../general/dbconn');
module.exports = (app) => {
    app.get('/doctors', (req, res) => {
        try {
            let db_conn = new DbConnection();
            var specSelect = [],
                catSelect = [];
            db_conn.conn.query('select distinct specialization from doctor_tbl', (err, result) => {
                if (err) throw err;
                if (Object.keys(result).length > 0) {
                    specSelect = result;
                }
            });
            db_conn.conn.query('select distinct category from doctor_tbl', (err, result) => {
                if (err) throw err;
                if (Object.keys(result).length > 0) {
                    catSelect = result;
                }
            });
            db_conn.conn.query('select * from doctor_tbl order by doctorId desc', (err, result) => {
                if (err) throw err;
                if (Object.keys(result).length > 0) {
                    res.render('doctors', {
                        request: req,
                        gridData: result,
                        specSelect: specSelect,
                        catSelect: catSelect
                    });
                } else
                    res.render('doctors', {
                        request: req,
                        gridData: [],
                        specSelect: specSelect,
                        catSelect: catSelect
                    });
            });
            db_conn.conn.end();
        } catch (Error) {
            throw Error;
        }
    });
    app.post('/doctors', (req, res) => {
        try {
            var info = trimObj(req.body);
            let db_conn = new DbConnection();
            if (info.doctorId == 0) {
                db_conn.conn.query('insert into doctor_tbl(companyId,fullName,address,email,mobile,licenceNo,specialization,category,serviceCharge,description)values(?,?,?,?,?,?,?,?,?,?)', [req.session.__companyId, info.fullName, info.address, info.email, info.mobile, info.licenceNo, info.specialization, info.category, info.serviceCharge, info.description], (err, result) => {
                    if (err) throw err;
                });
                db_conn.conn.end();
            } else if (info.doctorId > 0) {
                db_conn.conn.query('update doctor_tbl set companyId=?,fullName=?,address=?, email=?,mobile=?, licenceNo=?, specialization=?, category=?, serviceCharge=?, description=? where doctorId=?', [req.session.__companyId, info.fullName, info.address, info.email, info.mobile, info.licenceNo, info.specialization, info.category, info.serviceCharge, info.description, info.doctorId], (err, result) => {
                    if (err) throw err;
                });
                db_conn.conn.end();
            }
            res.json('success');
        } catch (Error) {
            throw Error;
        }
    });

    app.post('/doctorViewById', (req, res) => {
        try {
            var info = trimObj(req.body);
            let db_conn = new DbConnection();
            db_conn.conn.query('select * from doctor_tbl where doctorId=?', [info.doctorId], (err, result) => {
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

    app.post('/doctorDeleteById', (req, res) => {
        try {
            var info = trimObj(req.body);
            let db_conn = new DbConnection();
            db_conn.conn.query('delete from doctor_tbl where doctorId=?', [info.doctorId], (err, result) => {
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