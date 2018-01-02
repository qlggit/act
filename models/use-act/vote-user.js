module.exports = function(useAct){
    Object.assign(useAct , {
        voteUserList:function(data , call){
            useMysql.search(useSql.voteUser.list({
                voteId:data.voteId,
                userId:data.userId,
                pageNum:data.pageNum,
                pageSize:data.pageSize
            }),function(err , data){
                call && call(data);
            })
        },
        voteUserListOne:function(data , call){
            useMysql.searchOne(useSql.voteUser.list({
                voteId:data.voteId,
                userId:data.userId,
                pageNum:data.pageNum,
                pageSize:data.pageSize
            }),function(err , data){
                call && call(data);
            })
        },
    })
};