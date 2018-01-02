window.voteHandler = {};
$(function(){
    var hash = location.hash;
    if(hash){
        hash = hash.slice(1);
    }else{
        hash = resJson.voteChannel;
    }
    var code = 'hasVote' + resJson.voteId;
    if(!localStorage[code]){
        hash = 'rule';
    }
    localStorage[code] = 1;
    voteHandler.loadView = function(view){
        $showMain.html(view);
        return $showMain.children();
    };
    voteHandler.doInit = function(hash){
        location.hash = hash;
        classHandler(hash);
    };
    var $showMain = $('.show-main');
    var $voteFooter = $('.vote-footer');
    var footerList = [
        {
            code:'home',
            name:'首页',
        },
        {
            code:'rule',
            name:'规则',
        },
        {
            code:'sort',
            name:'排行',
        },
        {
            code:'join',
            name:resJson.hasJoin?'我的':'参与',
        },
    ];
    footerList.forEach(function(a){
        $voteFooter.append('<div class="foot-item text-center" foot-hash="'+a.code+'">' +
            '            <div class="item-img '+a.code+' margin-auto"></div>' +
            '            <div class="mt-14">'+a.name+'</div>' +
            '        </div>')
    });
    function hashHandler(hash){
        var obj = voteHandler[hash];
        if(!obj){
            hash = 'home';
            obj = voteHandler[hash];
        }
        if(obj.init && obj.init() === false)return false;
        voteHandler.doInit(hash);
    }
    function classHandler(ele){
        if(typeof ele === 'string'){
            ele = $('[foot-hash='+ele+']');
        }
        $voteFooter.find('.active').removeClass('active');
        ele.find('.item-img').addClass('active');
    }
    $voteFooter.on('click','.foot-item',function(){
        hashHandler($(this).attr('foot-hash'));
    });
    hashHandler(hash);
});