var express = require('express');
var router = express.Router();
router.get('/view/:voteId/:userId',useValidate.wechatLogin,useAct.voteData, function(req, res, next) {
    useAct.voteInfo({
        voteId:req.params.voteId ,
        userId:req.session.userId,
    },function(myInfo){
        useAct.voteInfoList({
            voteId:req.params.voteId ,
            userId:req.params.userId,
            myUserId:req.session.userId,
        }, function(voteInfo){
            res.useRender('vote/user-info',{
                resJson:{
                    voteInfo:voteInfo[0],
                    voteData:req.__voteData,
                    hasJoin:!!myInfo,
                    voteId:req.params.voteId,
                    userId:req.params.userId,
                }
            });
        })
    });

});
router.get('/my' , function(req, res, next) {
    useAct.voteInfoList({
        userId:req.session.userId,
        myUserId:req.session.userId,
        voteId:req.query.voteId,
    }, function(a){
        res.sendSuccess(a[0]);
    });
});
router.get('/list' , function(req, res, next) {
    useAct.voteUserList({
        userId:req.session.userId,
        voteId:req.query.voteId,
        pageNum:req.query.pageNum,
        pageSize:req.query.pageSize,
    }, function(a){
        res.sendSuccess(a);
    });
});
router.post('/do' , useValidate.checkSubscribe, function(req, res, next) {
    useMysql.searchOne(useSql.voteUser.voteInfo({
        voteInfoId:req.body.voteInfoId,
        addUserId:req.session.userId
    }),function(err , voteInfo){
        if(!voteInfo){
            return res.send({message:'无效的投票'});
        }
        useAct.voteData(voteInfo.voteId , function(voteData){
            if(new Date(voteData.info.startTime) > Date.now()){
                return res.send({message:'投票活动还未开始'});
            }
            if(new Date(voteData.info.endTime) < Date.now()){
                return res.send({message:'本次投票活动已截止'});
            }
            if(voteInfo.isVote){
                return res.send({message:'今天已经为TA投过票了'});
            }
            useMysql.add(useSql.common.add('vote_list',{
                date:useCommon.parseDate(new Date , 'Ymd'),
                vote_id:voteInfo.voteId,
                vote_info_id:voteInfo.id,
                user_id:voteInfo.userId,
                add_user_id:req.session.userId,
            }),function(err , data){
                if(err){
                    res.sendSqlData(err , data);
                }else{
                    useMysql.update(useSql.common.update('vote_info',{
                        count:voteInfo.count+1,
                    },{
                        id:req.body.voteInfoId,
                    }),function(err , data){
                        res.sendSqlData(err , data);
                    })
                }
            })
        });

    })
});
exports.router = router;
exports.__path = '/vote/user';