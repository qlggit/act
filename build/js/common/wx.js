WY.bind('wx-jssdk',function(){
  $.post('/wechat/jssdk',{
    url:location.href
  } , function(a){
    if(a.code === 0){
      var data = a.data;
      wx.config({
        debug: resJson.debug - 0,
        appId: data.appId,
        timestamp:data.timestamp ,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
          'previewImage',
          'getLocation',
          'scanQRCode',
          'openLocation',
          'closeWindow',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
        ]
      });
    }
  });
});
wx.error(function(err){
  console.log(err);
});
wx.ready(function(){
  WY.ready('wx-ready');
});
WY.trigger('wx-jssdk');

