var mysql = require('mysql');
var DbConnection = require('../general/dbconn');
module.exports = (app) => {
    app.get('/diagnosis', (req, res) => {
        try {
            let db_conn = new DbConnection();
            var docSelect = [],
                statSelect = [];
            db_conn.conn.query('select * from doctor_tbl order by doctorId desc', (err, result) => {
                if (err) throw err;
                if (Object.keys(result).length > 0)
                    docSelect = result;
            });
            db_conn.conn.query('select distinct status from diagnosis_tbl where status!=""', (err, result) => {
                if (err) throw err;
                if (Object.keys(result).length > 0)
                    statSelect = result;
            });
            db_conn.conn.query(`select t1.patientId,t1.companyId,t1.patientCode,t1.patientName,t1.mobile,t1.age,t1.place,t1.address,t1.email,count(t2.diagnosisId)as diagCount 
                    from patient_tbl t1 left join diagnosis_tbl t2 on t1.patientId=t2.patientId             
                    group by t1.patientId
                    order by t1.patientId DESC`, (err, result) => {
                if (err) throw err;
                res.render('diagnosis', {
                    request: req,
                    docSelect: docSelect,
                    statSelect: statSelect,
                    gridData: result
                });
            });

            db_conn.conn.end();
        } catch (Error) {
            throw Error;
        }
    });
    app.post('/addPatient', (req, res) => {
        try {
            var info = trimObj(req.body);
            let db_conn = new DbConnection();
            if (info.patientId == 0) {
                var patientCode = 0;
                db_conn.conn.query('select max(cast(patientCode as int))as patientCode from patient_tbl', (err, result) => {
                    if (err) throw err;
                    patientCode = parseInt(result[0].patientCode == null ? 0 : result[0].patientCode) + 1;
                    db_conn.conn.query('insert into patient_tbl(companyId,patientCode,patientName,mobile,age,place,address,email)values(?,?,?,?,?,?,?,?)', [req.session.__companyId, patientCode, info.patientName, info.mobile, info.age, info.place, info.address, info.email], (err, result) => {
                        if (err) throw err;
                        db_conn.conn.query('select * from patient_tbl where patientId=?', [result.insertId], (err, result) => {
                            if (err) throw err;
                            res.send(result[0]);
                        });
                        db_conn.conn.end();
                    });
                });
            } else if (info.patientId > 0) {
                db_conn.conn.query('update patient_tbl set patientName=?, mobile=?,age=?,place=?,address=?,email=? where patientId=?', [info.patientName, info.mobile, info.age, info.place, info.address, info.email, info.patientId], (err, result) => {
                    if (err) throw err;
                    res.json('updated');
                    db_conn.conn.end();
                });
            }
        } catch (Error) {
            throw Error;
        }
    });
    app.post('/patientViewById', (req, res) => {
        let db_conn = new DbConnection();
        var patientInfo = [];
        db_conn.conn.query('select * from patient_tbl where patientId=?', [req.body.patientId], (err, result) => {
            if (err) throw err;
            patientInfo.push(result);
            db_conn.conn.query('select * from diagnosis_tbl t1 left join doctor_tbl t2 on t1.doctorId=t2.doctorId where patientId=?', [req.body.patientId], (err, result) => {
                patientInfo.push(result);
                res.send(patientInfo);
                db_conn.conn.end();
            });
        });
    });
    app.post('/patientDeleteById', (req, res) => {
        let db_conn = new DbConnection();
        db_conn.conn.query('delete from diagnosis_tbl where patientId=?', [req.body.patientId], (err, result) => {
            if (err) throw err;
            db_conn.conn.query('delete from patient_tbl where patientId=?', [req.body.patientId], (err, result) => {
                if (err) throw err;
                res.json("deleted");
                db_conn.conn.end();
            });
        });
    });
    app.post('/addDiagnosis', (req, res) => {
        try {
            var info = trimObj(req.body);
            let db_conn = new DbConnection();
            if (info.diagnosisId == 0) {
                var diagnosisCode = 0;
                db_conn.conn.query('select max(cast(diagnosisCode as int))as diagnosisCode from diagnosis_tbl', (err, result) => {
                    if (err) throw err;
                    diagnosisCode = parseInt(result[0].diagnosisCode == null ? 0 : result[0].diagnosisCode) + 1;
                    db_conn.conn.query(`insert into diagnosis_tbl(companyId,diagnosisCode,patientId,diagnosisDetails,medicineDetails,accupunctureChannel,status,diagnosisDate,doctorId)
                    values(?,?,?,?,?,?,?,?,?)`, [req.session.__companyId, diagnosisCode, info.patientId, info.diagnosisDetails, info.medicineDetails, info.accupunctureChannel, info.status, info.diagnosisDate, (info.doctorId == 0 ? null : info.doctorId)], (err, result) => {
                        if (err) throw err;
                        db_conn.conn.query('select * from diagnosis_tbl where diagnosisId=?', [result.insertId], (err, result) => {
                            if (err) throw err;
                            res.send(result[0]);
                        });
                        db_conn.conn.end();
                    });
                });
            } else if (info.diagnosisId > 0) {
                db_conn.conn.query(`update diagnosis_tbl set diagnosisDetails=?, medicineDetails=?, accupunctureChannel=?,status=?,diagnosisDate=?, doctorId=? where diagnosisId=?`, [info.diagnosisDetails, info.medicineDetails, info.accupunctureChannel, info.status, info.diagnosisDate, info.doctorId, info.diagnosisId], (err, result) => {
                    if (err) throw err;
                    db_conn.conn.end();
                    res.json('updated');
                });
            }
        } catch (Error) {
            throw Error;
        }
    });
    app.post('/diagnosisViewById', (req, res) => {
        let db_conn = new DbConnection();
        db_conn.conn.query('select * from diagnosis_tbl where diagnosisId=?', [req.body.diagnosisId], (err, result) => {
            if (err) throw err;
            res.send(result[0]);
            db_conn.conn.end();
        });
    });

    app.post('/diagnosisDeleteById', (req, res) => {
        let db_conn = new DbConnection();
        db_conn.conn.query('delete from diagnosis_tbl where diagnosisId=?', [req.body.diagnosisId], (err, result) => {
            if (err) throw err;
            db_conn.conn.end();
            res.json("deleted");
        });
    });

    function trimObj(obj) {
        if (!Array.isArray(obj) && typeof obj != 'object') return obj;
        return Object.keys(obj).reduce(function (acc, key) {
            acc[key.trim()] = typeof obj[key] == 'string' ? obj[key].trim() : trimObj(obj[key]);
            return acc;
        }, Array.isArray(obj) ? [] : {});
    }
};