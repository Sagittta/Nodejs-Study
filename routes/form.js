var express = require('express');
// express 인스턴스를 사용하겠다.
var router = express.Router();
// express 프레임워크 라우터를 사용하기 위한 변수 선언

router.get('/', function(req, res, next) {
    res.render('form', {
        name: 'Jeon Eunjung',
        blog: 'gocoder.tistory.com',
        homepage: 'gocoder.net'
    });
});

router.post('/', function(req, res, next) {
    res.json(req.body);
});

module.exports = router;