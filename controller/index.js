var express = require('express');
var router = express.Router();

router.get('/',useValidate.wechatLogin, function(req, res, next) {
    res.send(req.session.wechat_info);
});
router.get('/common/view', function(req, res, next) {
    res.useRender(req.query.view);
});
exports.router = router;
exports.__path = '/';