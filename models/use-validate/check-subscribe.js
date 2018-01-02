module.exports = function(req , res , next){
    useData.getUserInfo(req.session , function(userInfo){
        if(userInfo && userInfo.subscribe - 0 === 1){
            next();
        }else{
            res.status(406);
            res.send({
                message:'请先关注公众号！',
                concern:1,
            });
        }
    } , req , res);
};