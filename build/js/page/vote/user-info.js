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
            WY.getLocationImg(url , function(newUrl){
                img.src = newUrl;
                img.onload = function(){
                    call && call(img);
                };
            });
        }
    };
    function getDrawOffset(imgWidth , imgHeight){
        var imgDrawWidth=canvasWidth,imgDrawHeight=canvasHeight;
        var x = 0,y=0,endX=imgWidth,endY=imgHeight;
        var changeX,changeY;
        if(imgWidth < canvasWidth || imgHeight < canvasHeight){
            if(imgWidth < canvasWidth && imgHeight < canvasHeight){
                if(canvasWidth / imgWidth > canvasHeight / imgHeight){
                    changeY = 1;
                }else{
                    changeX = 1;
                }
            }else if(imgWidth < canvasWidth){
                changeY = 1;
            }else{
                changeX = 1;
            }
        }else{
            if(imgWidth / canvasWidth > imgHeight / canvasHeight){
                changeX = 1;
            }else{
                changeY = 1;
            }
        }
        if(changeX){
            imgDrawWidth = canvasHeight / imgHeight * imgWidth;
            x = (imgDrawWidth - canvasWidth) *  imgWidth/ canvasWidth;
            endX = imgWidth - x;
        }
        else if(changeY){
            imgDrawHeight = canvasWidth / imgWidth * imgHeight;
            y = (imgDrawHeight - canvasHeight) *  imgHeight/ canvasHeight;
            endY = imgHeight - y;
        }
        return {
            x:x,
            y:y,
            width:endX - x,
            height:endY - y,
        };
    }
    function drawImg(img , offset , canvasOffset){
        if(!offset){
            offset = getDrawOffset(img.width , img.height);
        }
        if(!canvasOffset){
            canvasOffset = {x:0,y:0,width:canvasWidth , height:canvasHeight};
        }
        ctx.drawImage(img , offset.x,offset.y,offset.width,offset.height,canvasOffset.x,canvasOffset.y,canvasOffset.width,canvasOffset.height);
    }
    var canvasWidth = 750,canvasHeight=950,ctx,canvas=document.getElementById('user-info-canvas');
    var showImgHeight = WY.clientHeight - WY.getScaleSize(206);
    canvas.style.height = showImgHeight + 'px';
    var $showImg = $('.show-back-img');
    $showImg.width(WY.getScaleSize(750));
    $showImg.height(showImgHeight);
    var $showNotice = $('.show-notice-content').css('bottom','0.42rem');
    function drawCanvas(){
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        ctx = canvas.getContext('2d');
        imgLoad(resJson.voteInfo.img , function(img){
            drawImg(img);
            ctx.fillStyle = 'rgba(0,0,0,.6)';
            ctx.rect(0,0,canvasWidth,canvasHeight);
            ctx.fill();
            var canvasTop = 44;
            imgLoad(resJson.voteInfo.headimg , function(img){
                ctx.beginPath();
                circleImg(ctx , img , (750 - 238)/2,canvasTop,119);
                canvasTop+=238;
                ctx.beginPath();
                ctx.fillStyle = 'white';
                canvasTop+=28+26;
                ctx.font = '26px PingFang-SC-Heavy';
                ctx.fillText(resJson.voteInfo.nickname , (750 - ctx.measureText(resJson.voteInfo.nickname).width)/2,canvasTop);
                ctx.beginPath();
                canvasTop+= 16 + 24;
                ctx.fillStyle = 'rgb(198,198,198)';
                ctx.font = '24px PingFang-SC-Heavy';
                ctx.fillText(resJson.voteInfo.comment , (750 - ctx.measureText(resJson.voteInfo.comment).width)/2,canvasTop);
                canvasTop += 36;
                var left = (750 - 200) / 2;
                ctx.closePath();
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(24,24,24,.6)';
                ctx.fillStyle = 'rgba(255,255,255,.6)';
                ctx.moveTo(left , canvasTop);
                ctx.lineTo(left + 200, canvasTop);
                ctx.arc(left+200 , canvasTop + 25, 25 , -Math.PI/2 ,Math.PI/2 );
                ctx.lineTo(left , canvasTop + 50);
                ctx.arc(left , canvasTop + 25, 25 , Math.PI/2 ,Math.PI*3/2 );
                ctx.fill();
                ctx.closePath();
                ctx.beginPath();
                ctx.font = '28px PingFang-SC-Heavy';
                ctx.fillStyle = 'rgb(24,24,24)';
                var text = resJson.voteInfo.count + '票';
                ctx.fillText(text , (750 - ctx.measureText(text).width)/2,canvasTop +34);
                canvasTop = 950 - 34 - 42 - 26 - 200;
                imgLoad('/images/erweima.png' , function(img){
                    ctx.drawImage(img , (750-192)/2,canvasTop,192,192);
                    var imgUrl = canvas.toDataURL('image/png');
                    img = new Image;
                    img.src = imgUrl;
                    img.onload = function(){
                        $(canvas).remove();
                        $showImg.attr('src', imgUrl).show();
                    }
                });
            });
        });

    }
    function circleImg(ctx, img, x, y, r) {
        ctx.save();
        var d =2 * r;
        var cx = x + r;
        var cy = y + r;
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, x, y, d, d);
        ctx.restore();
    }
    drawCanvas();
    WY.ready('wx-ready',function(){
        $('.main-img').click(function(){
            wx.previewImage({
                urls:[resJson.voteInfo.img]
            })
        })
    })
});