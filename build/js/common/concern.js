
(function(){
    var $shareWindow ;
    WY.bind('wy-concern' , function(){
        $shareWindow = $shareWindow || $('.wy-share-window');
        $shareWindow.showEasyWindow();
    });
})();