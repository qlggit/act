module.exports = function(sql){
    sql.vote = {
        info:function(voteId){
            return  'select act.*,' +
                ' v.day_count day_count,v.all_count all_count,v.person_day_count person_day_count,v.person_all_count person_all_count,' +
                ' v.content content,v.notice notice,v.remark remark' +
                ' from act ' +
                ' left join vote v on v.act_id=act.id ' +
                ' where ' +  sql.sqlQuery({
                    'act.id':voteId,
                    'act.act_type':'vote',
                });
        },
        list:function(voteId){
            return  'select act.*,' +
                ' v.day_count day_count,v.all_count all_count,v.person_day_count person_day_count,v.person_all_count person_all_count,' +
                ' v.content content,v.notice notice,v.remark remark' +
                ' from act ' +
                ' left join vote v on v.act_id=act.id ' +
                ' where ' +  sql.sqlQuery({
                    'act.id':voteId,
                    'act.act_type':'vote',
                });
        },
        prize:function(voteId){
            return  'select prize.*' +
                ' from prize ' +
                ' left join vote v on v.act_id=prize.act_id' +
                ' where ' +  sql.sqlQuery({
                    'prize.act_id':voteId
                });
        },
    };
};