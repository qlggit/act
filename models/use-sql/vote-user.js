module.exports = function(sql){
    sql.voteUser = {
        list:function(data) {
            var date = useCommon.parseDate(new Date, 'Ymd');
            return 'select vl.id vote_list_id, count(vl.add_user_id) vote_count,vl.add_user_id other_user_id,' +
                'u.nickname nickname, u.headimg headimg, ' +
                'vi.id other_vote_id, vi.count other_count, ' +
                'vll.vote_id other_join_id ' +
                ' from vote_list vl ' +
                ' left join user u on u.user_id=vl.add_user_id ' +
                ' left join vote_info vi' +
                ' on vi.user_id=vl.add_user_id ' +
                ' and vi.vote_id="'+data.voteId+'" ' +
                ' left join vote_list vll' +
                ' on vll.user_id=vl.add_user_id ' +
                ' and vll.add_user_id=vl.user_id ' +
                ' and vll.vote_id=vl.vote_id'+
                ' and vll.date='+date+
                ' where ' + sql.sqlQuery({
                    'vl.vote_id': data.voteId,
                    'vl.user_id': data.userId,
                    groupBy:'vl.add_user_id',
                    pageNum:data.pageNum,
                    pageSize:data.pageSize,
                });
        },
        voteInfo:function(data) {
            return 'select vi.* ,' +
                'vl.add_user_id is_vote' +
                ' from vote_info vi ' +
                ' left join vote_list vl on vi.vote_id=vl.vote_id ' +
                ' and vi.user_id=vl.user_id ' +
                ' and vl.add_user_id='+ (data.addUserId||data.userId) +
                ' and vl.date='+ useCommon.parseDate(new Date, 'Ymd') +
                ' where ' + sql.sqlQuery({
                    'vi.vote_id': data.voteId,
                    'vi.user_id': data.userId,
                    'vi.id': data.voteInfoId,
                });
        }
    };
};