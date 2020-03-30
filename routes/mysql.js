var express = require('express');
var router = express.Router();
var mysql = require('mysql');
// mysql 인스턴스 가져옴

router.get('/', function(req, res, next) {
    var connection = mysql.createConnection({
        // 데이터베이스 설정 입력
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'mirim2',
        database: 'nodedb'
    });

    connection.connect(function(err) {
        // 접속과 동시에 연결 설정에 대한 확인
        if (err) {
            res.render('mysql', { connect: '연결 실패', err: err});
            console.error(err);
            throw err;
        } else {
            res.render('mysql', { connect: '연결 성공', err: '없음'});
        }
    });
    connection.end();
//    연결 종료
});

module.exports = router;