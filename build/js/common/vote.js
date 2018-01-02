(function(){
    var voteTimer;
    WY.bind('wy-vote' , function(data , call){
        voteTimer = setTimeout(function(){
            $.post('/vote/user/do',data,function(a){
                useCommon.toast(a.message);
                if(a.code === 0){
                    call && call();
                }
            });
        },100);

    });
})();