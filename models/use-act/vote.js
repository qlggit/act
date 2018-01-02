var cacheData = {
    voteData:{}
};
module.exports = function(useAct){
    Object.assign(useAct , {
        voteData:function(req , res , next){
            var voteId;
            if(next){
                voteId = req.params.voteId || req.query.voteId || req.body.voteId
            }else voteId = req;
            if(cacheData.voteData[voteId]){
                if(next){
                    req.__voteData = cacheData.voteData[voteId];
                    next();
                }
                else res && res(cacheData.voteData[voteId]);
            }else{
                var data = {};
                useMysql.searchOne(useSql.vote.info(voteId),function(err , info){
                    data.info = info;
                    useMysql.search(useSql.vote.prize(voteId),function(err , prizeData){
                        data.prize = prizeData;
                        cacheData.voteData[voteId] = data;
                        if(next){
                            req.__voteData = data;
                            next();
                        }
                        else res && res(data);
                    })
                })
            }
        },
        voteInfo:function(data , call){
            useMysql.searchOne(useSql.common.search('vote_info',{
                voteId:data.voteId,
                userId:data.userId,
            }),function(err , info){
                call && call(info);
            })
        },
        voteInfoList:function(data , call){
            useMysql.search(useSql.voteInfo.list({
                voteId:data.voteId,
                userId:data.userId,
                code:data.code,
                myUserId:data.myUserId,
                pageNum:data.pageNum,
                pageSize:data.pageSize
            }),function(err , data){
                call && call(data);
            })
        },
        voteInfoSort:function(data , call){
            useMysql.search(useSql.voteInfo.sort({
                voteId:data.voteId,
                userId:data.userId,
            }),function(err , data){
                call && call(data);
            })
        },
    })
};