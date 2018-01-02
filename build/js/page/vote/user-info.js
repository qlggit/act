$(function(){
    $('.vote-btn').click(function(){
        var $btn = $(this);
        if($btn.hasClass('able')){
            WY.trigger('wy-vote',{
                voteInfoId:$btn.attr('code'),
            },function(){
                $btn.removeClass('able').html('已投票');
                $('.show-count').html($('.show-count').attr('count')-0+1+'票');
            });
        }
    });
    var imgLoad = function ( url , call){
        var img = new Image;
        if(url.indexOf('/') === 0){
            img.src = url;
            img.onload = function(){
                call && call(img);
            };
        }else{
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function() {
                if(xhr.status === 200){
                    var blob = xhr.response;
                    var newUrl = URL.createObjectURL(blob);
                    img.src = newUrl;
                    img.onload = call;
                }
            };
            xhr.send();
        }
    }
    function drawCanvas(canvas){
        canvas.width = 750;
        canvas.height = 950;
        var ctx = canvas.getContext('2d');
        var img = imgLoad();
    }
    drawCanvas(document.getElementById('user-info-canvas'));
    WY.ready('wx-ready',function(){
        $('.main-img').click(function(){
            wx.previewImage({
                urls:[resJson.voteInfo.img]
            })
        })
    })
});