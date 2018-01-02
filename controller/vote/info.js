var express = require('express');
var router = express.Router();
router.get('/view/:channel/:voteId',useValidate.wechatLogin,useAct.voteData,function(req, res, next) {
    var voteData = req.__voteData;
    useMysql.searchOne(useSql.common.search('vote_info',{
        userId:req.session.userId,
        voteId:req.params.voteId,
    }),function(err , data){
        res.useRender('vote/index',{
            resJson:{
                voteId:req.params.voteId,
                voteData:voteData,
                voteChannel:req.params.channel,
                hasJoin:!!data
            }
        });
    });
});
router.post('/add',useValidate.checkSubscribe , useAct.voteData , function(req, res, next) {
    var voteData = req.__voteData;
    var body = req.body;
    if(new Date(voteData.info.startTime) > Date.now()){
        return res.send({message:'活动还未开始！'});
    }
    if(new Date(voteData.info.endTime) < Date.now()){
        return res.send({message:'活动已经结束！'});
    }
    useMysql.searchOne(useSql.common.search('vote_info',{
        user_id:req.session.userId,
        vote_id:body.voteId,
    }) , function(err , data){
        if(data){
            res.send({
                message:'已经有参与 不能重复参加'
            });
            return;
        }
        useMysql.count(useSql.common.count('vote_info',{
            vote_id:body.voteId,
        }),function(err , data){
            var count = 0;
            if(data)count = data.allNumber;
            count ++ ;
            useMysql.add(useSql.common.add('vote_info', {
                user_id:req.session.userId,
                vote_id:body.voteId,
                code:('00000' + count).slice(-5),
                img:body.img,
                comment:body.comment,
            }) ,function(err , data){
                res.sendSqlData(err , data);
            })
        });

    })
});
router.get('/list', function(req, res, next) {
    useAct.voteInfoList({
        myUserId:req.session.userId,
        voteId:req.query.voteId,
        code:req.query.code,
        pageNum:req.query.pageNum,
        pageSize:req.query.pageSize,
    }, function(a){
        res.sendSuccess(a);
    })
});
router.get('/sort', function(req, res, next) {
    useAct.voteInfoSort({
        userId:req.session.userId,
        voteId:req.query.voteId,
    }, function(a){
        res.sendSuccess(a);
    })
});
exports.router = router;
exports.__path = '/vote/info';