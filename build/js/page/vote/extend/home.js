voteHandler.home = {
    init:function(){
        var that = this;
        WY.resetTitle();
        WY.trigger('load-view' , 'vote/home',function(view){
            that.mainView = voteHandler.loadView(view);
            that.start();
        });
    },
    start:function(){
        this.reset();
        this.doSearch();
        var voteTimer;
        this.mainView.on('click','.vote-btn',function(){
            var $btn = $(this);
            WY.trigger('wy-vote',{
                voteInfoId:$btn.attr('code'),
            },function(){
                that.reset();
                that.doSearch();
            });
            return false;
        });
        this.mainView.on('click','.item-list',function(){
            location.href = $(this).attr('url');
            return false;
        });
        var that = this;
        WY.trigger('do-scroll',{
            ele:this.mainView.find('.main'),
            margin:WY.getScaleSize(120)
        },function(){
            that.showMore();
        });
        this.mainView.find('.search-input').bind('input' , function(){
            that.doInput($(this).val().trim());
        });
    },
    doInput:function(v){
        clearTimeout(this.inputTimer);
        var that = this;
        this.inputTimer = setTimeout(function(){
            that.reset();
            that.doSearch(v);
        },500);
    },
    showMore:function(){
        console.log('showMore');
        if(!this.isSearching && this.allLength >= this.pageSize && this.lastLength >= this.pageSize){
            this.pageNum ++;
            this.doSearch();
        }
    },
    doSearch:function(v){
        var that = this;
        $.get('/vote/info/list',{
            voteId:resJson.voteId,
            pageNum:this.pageNum,
            code:v || '',
            pageSize:this.pageSize,
        },function(a){
            that.setList(a.data);
        })
    },
    reset:function(){
        this.pageNum = 1;
        this.pageSize = 10;
        this.flexCount = 0;
        this.allLength = 0;
        this.mainView.find('.data-list').remove();
        this.flexContent = this.getFlex();

    },
    getFlex:function(){
        var $ele = $('<div class="flex-between data-list mb-20">');
        this.mainView.find('.main').append($ele);
        return $ele;
    },
    setList:function(list){
        var that = this;
        this.isSearching = 0;
        this.lastLength = list.length;
        this.allLength += this.lastLength;
        list.forEach(function(a){
           if(that.flexCount >=2){
               that.flexCount = 0;
               that.flexContent = that.getFlex();
           }
            that.flexContent.append('<div class="item-list back-white border-rad-10" url="/vote/user/view/'+a.voteId+'/'+a.userId+'">' +
                '                <div class="flex-left">' +
                '                    <img src="'+a.headimg+'" class="head-img border-rad-100" alt="">' +
                '                    <div class="pl-20 pt-10 user-content">' +
                '                        <div class="fz-30 color-24 flex-between "><span class="inline-block width-140 write-ellipsis">'+a.nickname+'</span><span>'+a.code+'</span></div>' +
                '                        <div class="color-104 fz-24 pt-8">'+a.comment+'</div>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="mt-20 content position-relative" style="background-image: url('+a.img+')">' +
                '                    <div class="position-full content-main position-absolute '+(a.isVote?'':'able')+' ">' +
                (a.isVote?(
                    '<div class="count text-center  border ">'+a.count+'票'+(a.isVote?(' 排名'+(a.userIndex+1)):'')+'</div>'
                ):(
                    '<div class="count text-center  border ">'+a.count+'票'+(a.isVote?(' 排名'+(a.userIndex+1)):'')+'</div>'+
                    '<div class="sort fz-38 ">排名'+(a.userIndex+1)+'</div>' +
                    '<div code="'+a.id+'" class="vote-btn border back-white margin-auto text-center ">投票</div>'
                ))+
                '                    </div>' +
                '                </div>\n' +
                '            </div>');
            that.flexCount++;
        });
        if(this.lastLength < this.pageSize ){
            this.flexContent.after('<div class="data-list pr-20 pb-20 color-194 fz-24 text-center">没有更多了</div>')
        }
    }
};