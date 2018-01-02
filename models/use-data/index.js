module.exports = {
    getUserInfo:function(userInfo,call , req , res){
        useMysql.searchOne(useSql.common.search('user',{
            openid:userInfo.openId,
        }),function(err , data){
           if(!data){
               useData.addUser(userInfo , function(){
                   useData.getUserInfo(userInfo , call , req , res);
               });
               return ;
           }else{
               if(req && res && req.session){
                   if(data.userId && !req.session.userId){
                       req.session.userId = data.userId;
                       useSession.save(req , res , function(){
                           call && call(data);
                       });
                       return;
                   }
               }
           }
           call && call(data);
        });
    },
    init:function(call){
        require('./add')(this);
        this.req = {session:{},body:{},query:{},headers:{'x-forwarded-for':'127.0.0.1'}};
        this.res = {};
        call && call();
    }
};


