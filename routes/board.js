var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();
// express 와 db 연결

router.get('/list', function(req, res, next) {
    res.redirect('/board/list/1');
});

router.get('/list/:page', function(req, res, next) {
    // URI 를 /list/:page 형태로 받음. board/list/(페이지 숫자) 형식으로 게시판 리스트 노출
    var page = req.params.page;
    // URI 변수 ':page' 로 맵핑된 page 값을 req 객체로 가져옴.
    // 페이징 개발을 위해 미리 선언함.
    var sql = "SELECT idx, name, title, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, date_format(regdate, '%Y-%m-%d %H:%i:%s') regdate FROM board";
    // sql 문 수행
    conn.query(sql, function(err, rows) {
        // select 된 행을 가져와서 rows 변수에 담고, 오류가 있으면 err 변수에 담음
        if (err) console.error("err : " + err);
        res.render('list', { title: '게시판 리스트', rows: rows });
    //    수행된 데이터를 list 뷰로 렌더링
    });
});

module.exports = router;