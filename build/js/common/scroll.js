WY.bind('do-scroll' , function(data , done){
    var scrollTimer;
    data.ele.bind('scroll',function(e){
        if($(this)[0].scrollTop + $(this).height() + (data.margin || 0) > useCommon.sum($(this).children().map(function(){
            return $(this).outerHeight();
        }).toArray())){
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(done , 100);
        }
    })
});