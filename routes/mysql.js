var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var mysql_odbc = require('../db/db_conn')();
    var conn = mysql_odbc.init();
    conn.connect(function(err) {
        if (err) {
            res.render('mysql', { connect: '연결 실패', err: err });
            console.error(err);
            throw err;
        } else {
            res.render('mysql', { connect: '연결 성공', err: '없음' });
        }
    });
    conn.end();
})

module.exports = router;