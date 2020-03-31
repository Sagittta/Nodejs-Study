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

router.get('/page', function(req, res, next) {
    res.redirect('/board/page/1');
});

router.get('/page/:page', function(req, res, next) {
    // page 라는 URI 접속 경로 추가 (기존 리스트에 페이징 추가)
    var page = req.params.page;
    // 현재 페이지를 req 객체를 통해 가져옴
    var sql = "SELECT idx, name, title, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, date_format(regdate, '%Y-%m-%d %H:%i:%s') regdate, hit FROM board";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        res.render('page', { title: '게시판 리스트', rows: rows, page: page, length: rows.length-1, page_num: 3, pass: true });
        // rows: 데이터베이스 쿼리에 데이터 렌더링, page: 현재 페이지 랜더링
        // length: 데이터에 전체 길이를 랜더링. (-1은 db 행 전체는 1부터 시작이지만 for 문은 0부터 시작이므로)
        // page_num: 한 페이지에 보여줄 행의 갯수
        console.log(rows.length-1);
    });
});

// 글쓰기 페이지 바인딩
router.get('/write', function(req, res, next) {
    // write.ejs 렌더링
    res.render('write', { title: '게시판 글 쓰기'});
});

// 글쓰기 db 연동
router.post('/write', function(req, res, next) {
    // post 방식으로 /write 에 들어갈 때
    var name = req.body.name;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    // req 객체로 body 속성에서 input name 파라미터 가져옴
    var datas = [name, title, content, passwd];
    // 모든 데이터를 배열로 묶음

    var sql = "INSERT INTO board (name, title, content, regdate, modidate, passwd, hit) VALUES (?, ?, ?, now(), now(), ?, 0)";
    // ? 매개변수로 배열에 있는 데이터와 순서대로 맵핑됨.
    conn.query(sql, datas, function(err, rows) {
        // query 함수로 sql 실행, datas 를 매개변수로 데이터 입력
        if (err) console.error("err : " + err);
        res.redirect('/board/list');
    //    오류 없으면 list 페이지로 이동.
    });
});

// 상세 페이지 바인딩
router.get('/read/:idx', function(req, res, next) {
    var idx = req.params.idx;
    // read 라는 URI 뒤의 idx 게시글의 고유번호를 받음.
    var sql = "SELECT idx, name, title, content, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate," +
        "date_format(regdate, '%y-%m-%d %H:%i:%s') regdate, hit FROM board WHERE idx = ?";
    // 선택한 게시글만 불러오는 쿼리문 작성
    conn.query(sql, [idx], function(err, row) {
        // 매개변수에 idx 전달
        if (err) console.error("err : " + err);
        res.render('read', { title: "글 상세", row: row[0] });
    //     한개의 데이터만 가져오도록 첫 번째 행만 요청함.
    });
});

// 글 수정 연동
router.post('/update', function(req, res, next) {
    // post 방식으로 넘어오는 /update URI 바인딩
    var idx = req.body.idx;
    var name = req.body.name;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var datas = [name, title, content, idx, passwd];
    // 변수로 넘어온 데이터를 배열로 합침

    var sql = "UPDATE board SET name = ?, title = ?, content = ?, modidate = now() WHERE idx = ? AND passwd = ?";
    // 글 고유번호와 비밀번호가 조건절
    conn.query(sql, datas, function(err, result) {
        if (err)    console.error("err : " + err);
        if (result.affectedRows == 0) {
            // affectedRows => 해당 쿼리로 변경된 수에 행을 불러옴. 0 이면 업데이트가 되지 않은 것이므로 비밀번호가 틀린 것.
            res.send("<script>alert('패스워드가 일치하지 않습니다.');    history.back();</script>");
        //    패스워드가 틀렸으면 이전 페이지로 다시 보냄 (send)
        } else {
            res.redirect('/board/read/' + idx);
        }
    });
});

module.exports = router;