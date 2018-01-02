voteHandler.rule = {
    init:function(){
        var that = this;
        WY.setTitle('活动规则');
        if(that.loadView){
            voteHandler.doInit('rule');
            if(this.loadData){
                this.doLoad();
                return false;
            }
            this.doSearch();
            return false;
        }
        WY.trigger('load-view' , 'vote/rule',function(view){
            that.loadView = view;
            that.doSearch();
        });
    },
    getPrizeStr:function(data){
        data = useCommon.parse(data);
        var start , end;
        data.forEach(function(a){
            if(start){
                start += '<div class="pt-24">'+a.start+'</div>'
            }else{
                start = '<div class="">'+a.start+'</div>'
            }
            if(end){
                end += '<div class="pt-24">'+a.end+'</div>'
            }else{
                end = '<div class="">'+a.end+'</div>'
            }
        })
        return [start,end];
    },
    doLoad:function(){
        this.mainView = voteHandler.loadView(this.loadView);
        var mainView = this.mainView;
        this.loadData.info.notice = this.loadData.info.notice.replace(/\r|\n|\n\r/,function(){
            return '<br>';
        });
        this.loadData.info.remark = this.loadData.info.remark.replace(/\r|\n|\n\r/g,function(){
            return '<br>';
        }).replace(/\<br\>(\s)*\<br\>/g,'<br>');
        mainView.__formData(this.loadData.info , 'act-info');
        var $prizeMain = mainView.find('.prize-main');
        var that = this;
        this.loadData.prize.forEach(function(a , i){
            var prizeStr = that.getPrizeStr(a.prizeContent);
            $prizeMain.append('<div class="item margin-auto border-rad-10 border-24 '+(i?'mt-50':'')+'">' +
                '                <div class="width-80-100 text-left  margin-auto">' +
                '                    <div class="fz-weight">'+a.prizeLvlName+'<span class="pl-20">'+a.prizeNumber+'名</span>' +
                '<span class="pl-20">'+a.prizeName+'</span></div>' +
                '                    <div class=" pt-24 flex-left flex-top">' +
                '                        <div class="text-top">包含：</div>' +
                '                        <div class="pl-20 left">' +
                prizeStr[0]+
                '                        </div>' +
                '                        <div class="pl-30">' +
                prizeStr[1]+
                '                        </div>' +
                '                    </div>' +
                '                </div>' +
                '            </div>')
        });
    },
    doSearch:function(){
        var that = this;
        $.get('/vote/info',{
            voteId:resJson.voteId,
        },function(a){
            that.loadData = a.data;
            that.doLoad();
        })
    },
};