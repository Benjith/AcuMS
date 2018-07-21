var mysql = require('mysql');
const toastr = require('toastr');
var DbConnection = require('../general/dbconn');
module.exports = (app) => {
    var info;
    app.get('/company', (req, res) => {
        try {
            if (req.session.__userId) {
                let db_conn = new DbConnection();
                console.log("LOGGED_USER_ID : " + req.session.__userId);
                db_conn.conn.query('select t1.companyId,t1.companyName,t1.city,t1.email,t1.phone,t1.mobile,t1.description,t1.entryDate from company_tbl t1 inner join user_tbl t2 on t1.companyId=t2.companyId where t2.userId=?', [req.session.__userId], (err, result) => {
                    if (err) throw err;
                    if (Object.keys(result).length > 0) {
                        Object.keys(result).forEach((key) => {
                            info = result[key];
                            res.render('company', {
                                request: req,
                                data: info
                            });
                        });
                    } else
                        res.redirect('/login');
                });
                db_conn.conn.end();
            } else
                res.redirect('/login');
        } catch (Error) {
            throw Error;
        }
    });
    app.post('/company', (req, res) => {
        try {            
            var info=trimObj(req.body);
            let db_conn = new DbConnection();
            db_conn.conn.query('update company_tbl set companyName=?,city=?,email=?,phone=?,mobile=?,description=? where companyId=?', [info.companyName, info.city, info.email, info.phone, info.mobile, info.description, req.session.__companyId], (err, result) => {
                console.log("COMPANY_UPADTED");
            });
            db_conn.conn.end();        
            res.json('success:true;');
        } catch (Error) {
            throw Error;
        }
    });

    function trimObj(obj) {
        if (!Array.isArray(obj) && typeof obj != 'object') return obj;
        return Object.keys(obj).reduce(function(acc, key) {
          acc[key.trim()] = typeof obj[key] == 'string'? obj[key].trim() : trimObj(obj[key]);
          return acc;
        }, Array.isArray(obj)? []:{});
      }
};