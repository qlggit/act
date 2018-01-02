module.exports = function(sql){
    sql.voteInfo = {
        list:function(data){
            var url = 'select vi.*, ' +
                ' u.nickname nickname,u.headimg headimg,' +
                ' (select vote_info_id from vote_list ' +
                ' where add_user_id='+data.myUserId+' ' +
                ' and user_id=vi.user_id ' +
                ' and vote_id=' + data.voteId +
                ' and date="'+useCommon.parseDate(new Date , 'Ymd')+'") is_vote,' +
                ' (select count(vii.user_id) user_index' +
                '                 from vote_info vii' +
                '                 where vii.vote_id='+data.voteId+' and vii.count > vi.count'+
                '                or (vii.count = vi.count and vii.id < vi.id)'+
                '                 order by vii.count desc) user_index '+
                ' from vote_info vi ' +
                ' left join user u on u.user_id=vi.user_id' +
                ' where ';
            if(data.code){
                url += ' vi.code like "%'+data.code+'%" and ';
            }
            url += sql.sqlQuery({
                    'vi.vote_id':data.voteId,
                    'vi.user_id':data.userId,
                    orderBy:' vi.create_time desc ',
                    pageNum:data.pageNum,
                    pageSize:data.pageSize,
                });

            return  url;
        },
        sort:function(data){
            return  'select vi.*, ' +
                ' u.nickname nickname,u.headimg headimg,' +
                ' (select vote_info_id from vote_list ' +
                ' where add_user_id='+data.userId+' ' +
                ' and user_id=vi.user_id ' +
                ' and vote_id=' + data.voteId +
                ' and date="'+useCommon.parseDate(new Date , 'Ymd')+'") is_vote' +
                ' from vote_info vi ' +
                ' left join user u on u.user_id=vi.user_id' +
                ' where ' +  sql.sqlQuery({
                    'vi.vote_id':data.voteId,
                    orderBy:' vi.count desc,vi.id ',
                    pageNum:1,
                    pageSize:10,
                })
        },
    };
};