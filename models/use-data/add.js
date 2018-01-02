module.exports = function(useData){
    useData.addUser = function(userInfo , call){
        useRequest.send({},{},{
            url:useUrl.user.add,
            data:userInfo,
            method:'POST',
            done:call
        });
    }
};