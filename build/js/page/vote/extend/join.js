voteHandler.join = {
    init:function(){
        var that = this;
        if(new Date(resJson.voteData.info.startTime) > Date.now()){
            useCommon.toast('活动还未开始');
            if(resJson.voteChannel === 'join' && !location.hash || (location.hash === '#join')){
                voteHandler.rule.init();
                voteHandler.doInit('rule');
            }
            return false;
        }
        if(!resJson.hasJoin && new Date(resJson.voteData.info.endTime) < Date.now()){
            useCommon.toast('活动已经结束');
            if(resJson.voteChannel === 'join' && !location.hash || (location.hash === '#join')){
                voteHandler.rule.init();
                voteHandler.doInit('rule');
            }
            return false;
        }
        WY.setTitle('上传照片');
        WY.trigger('load-view' , 'vote/join&hasJoin='+(resJson.hasJoin||''),function(view){
            that.mainView = voteHandler.loadView(view);
            if(resJson.hasJoin){
                that.pageNum = 1;
                that.pageSize = 10;
                that.searchInfo();
                that.reset();
                that.doSearch();
            }else{
                that.doJoin();
            }
        });
    },
    reset:function(){
        this.isSearching = 0;
        this.showMain = $('.add-show-main');
        this.showMain.find('.data-list').remove();
        this.allLength = 0;
        this.pageNum = 1;
        this.pageSize = 10;
    },
    searchInfo:function(){
        var mainView = this.mainView;
        $.get('/vote/user/my',{
            voteId:resJson.voteId,
        } , function(a){
            a.data.userIndex ++ ;
            mainView.__formData(a.data , 'vote-info');
        })
        mainView.on('click','.vote-btn',function(){
            var $btn = $(this);
            var code = $btn.attr('code');
            if($btn.hasClass('able')){
                WY.trigger('wy-vote',{
                    voteInfoId:code,
                },function(){
                    that.doCode(code);
                });
            }
        });
        var that = this;
        WY.trigger('do-scroll',{
            ele:mainView.find('.add-show-main'),
            margin:WY.getScaleSize(120)
        },function(){
            that.showMore();
        });
    },
    doCode:function(code){
        this.mainView.find('[code='+code+']').each(function(){
            var $btn  = $(this);
            $btn.removeClass('able').html('已投');
            var $count = $btn.closest('.join-item').find('[count]');
            var count = $count.attr('count') - 0;
            count ++ ;
            $count.attr('count' , count).html(count + '票');
        });
    },
    showMore:function(){
        if(!this.isSearching && this.allLength >= this.pageSize && this.lastLength >= this.pageSize){
            this.pageNum ++;
            this.doSearch();
        }
    },
    doSearch:function(){
        var that = this;
        this.isSearching = 1;
        $.get('/vote/user/list',{
            voteId:resJson.voteId,
            pageNum:this.pageNum,
            pageSize:this.pageSize,
        } , function(a){
            that.setList(a.data);
        });
    },
    setList:function(list){
        this.lastLength = list.length;
        this.allLength += this.lastLength;
        this.isSearching = 0;
        var $showMain = this.showMain;
        list.forEach(function(a){
            $showMain.append('<div class="join-item flex-between fz-26 pr-30 data-list">' +
                '                <div class="item flex-left left" do-href-link="'+(a.otherJoinId?('/vote/user/view/'+a.otherJoinId+'/'+a.otherUserId):'')+'">' +
                '                    <img src="'+a.headimg+'" class="head-img border-rad-100" alt="">' +
                '                    <div class="fz-weight color-24 write-ellipsis">'+a.nickname+'</div>' +
                '                </div>' +
                '                <div class="item center text-center text-middle" count="'+a.otherCount+'">'+a.voteCount+'票'+'</div>' +
                '                <div class="item right">' +
                '                    <div code="'+a.otherVoteId+'" class="btn btn-lang color-194  vote-btn '+(a.otherVoteId&&!a.otherJoinId?'able':'')+'">'+(a.otherVoteId?(a.otherJoinId?'已投':'为TA投票'):'暂未参与')+'</div>' +
                '                </div>' +
                '            </div>')
        });
        if(this.lastLength < this.pageSize && this.allLength >= this.pageSize){
            $showMain.append('<div class="data-list pr-20 pb-20 color-194 fz-24 text-center">没有更多了</div>')
        }
    },
    doJoin:function(){
        var mainView = this.mainView;
        var $file = $('<input type="file">');
        mainView.append($file.hide());
        var $photoImg = mainView.find('.photo-img');
        $photoImg.click(function(){
            $file[0].click();
        });
        var fileUrl;
        $file.change(function(){
            if(this.files[0]){
                WY.getFileUrl(this.files[0],function(url){
                    $photoImg.attr('src' , fileUrl = url);
                });
            }
        });
        var that = this;
        mainView.find('.do-submit-btn').click(function(){
            var data = {
                file:useCommon.convertBase64UrlToBlob(fileUrl , 'image/png'),
                comment:mainView.find('[name=comment]').val()
            };
            var valid = useValidate.validator({
                file:{
                    required:1,
                    message:'请上传图片',
                },
                comment:{
                    required:1,
                    message:'请填写描述',
                }
            } , data);
            if(!valid.valid){
                useCommon.toast(valid.message);
                return false;
            }
            WY.uploadFile(data.file , {
                done:function(a){
                    var img = a.data && a.data.filePath;
                    if(img){
                        $.post('/vote/info/add' , {
                            voteId:resJson.voteId,
                            img:img,
                            comment:data.comment
                        },function(a){
                            if(a.code === 0){
                                resJson.hasJoin = 1;
                                that.init();
                            }else{
                                useCommon.toast(a.message);
                            }
                        });
                    }else{
                        useCommon.toast(a.message);
                    }
                }
            })

        });
    }
};