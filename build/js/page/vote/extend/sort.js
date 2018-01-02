voteHandler.sort = {
    init:function(){
        var that = this;
        WY.resetTitle();
        WY.trigger('load-view' , 'vote/sort',function(view){
            that.mainView = voteHandler.loadView(view);
            that.searchInfo();
            that.doSearch();
        });
    },
    searchInfo:function(){
        var mainView = this.mainView;
        $.get('/vote/user/my',{
            voteId:resJson.voteId,
        } , function(a){
            if(a.data){
                mainView.__formData(a.data , 'vote-info');
                $('.show-user-info').show();
            }
        });
        var that = this;
        mainView.on('click','.vote-btn',function(){
            var $btn = $(this);
            if($btn.hasClass('able')){
                WY.trigger('wy-vote',{
                    voteInfoId:$btn.attr('code'),
                },function(){
                    that.doSearch();
                });
            }
        })
    },
    doSearch:function(){
        var that = this;
        $.get('/vote/info/sort',{
            voteId:resJson.voteId,
            pageNum:this.pageNum,
            pageSize:this.pageSize,
        } , function(a){
            that.setList(a.data);
        });
    },
    setList:function(list){
        var $showMain = $('.show-sort-main');
        $showMain.find('.sort-item').remove()
        list.forEach(function(a , i){
            $showMain.append('<div class="sort-item flex-between fz-26">' +
                '                <div class="sort item flex-center">' +
            '                <div class="num color-white text-center">'+(i+1)+'</div>' +
            '                </div>' +
            '                <div class="user pl-20 flex-left item" do-href-link="/vote/user/view/'+a.voteId+'/'+a.userId+'">' +
                '                <div class="'+(i<3?'img-back':'')+'">' +
                '                <img src="'+a.headimg+'" class="head-img border-rad-100" alt="">' +
                '                </div>' +
                '                <div class="pl-20 write-ellipsis">'+a.nickname+'</div>' +
            '                </div>' +
                '             <div class="count item">' +
                '                '+a.count+'票' +
                '            </div>' +
                '            <div class="btn-content text-center">' +
                '                <div code="'+a.id+'" class="btn btn-lang vote-btn margin-auto color-194 '+(a.isVote?'':'able')+'">'+(a.isVote?'已投':'为TA投票')+'</div>' +
                '                </div>' +
                '                </div>')
        });
    },
};