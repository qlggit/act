WY.ready('wx-ready' , function(){
    var str = resJson.voteInfo?('2018，我为娱客代言，朋友们快来为我投上宝贵的一票吧！编号：'+resJson.voteInfo.code):'2018我行我秀，娱动全城，赢娱客内测万元大礼包';
    var timeStr = resJson.voteInfo?('2018，我为娱客代言，朋友们快来为我投上宝贵的一票吧！编号：'+resJson.voteInfo.code):'我为娱客代言--2018我行我秀，娱动全城，赢娱客内测万元大礼包';
    wx.onMenuShareAppMessage({
        title:'我为娱客代言',
        desc:str ,
        imgUrl:(resJson.voteInfo && resJson.voteInfo.img) || 'http://act.yukew.com/images/logo.png',
        link:location.href,
    });
    wx.onMenuShareTimeline({
        title:timeStr,
        link:location.href,
        imgUrl:(resJson.voteInfo && resJson.voteInfo.img) || 'http://act.yukew.com/images/logo.png',
    });
});