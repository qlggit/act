WY.getFileUrl = function(file , call){
    var url;
    try{
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
            url = this.result;
            next();
        }
    }catch(e){
        try{
            if(window.URL){
                url = URL.createObjectURL(file);
            }else{
                url = webkitURL.createObjectURL(file);
            }
        }catch (e){

        }
        next();
    }
    function next(){
        dealImage(url , {} ,function(url){
            call && call(url);
        });
        function dealImage(path, obj, callback){
            var img = new Image();
            img.src = path;
            img.onload = function(){
                var that = this;
                // 默认按比例压缩
                var w = that.width,
                    h = that.height,
                    scale = w / h;
                w = obj.width || w;
                h = obj.height || (w / scale);
                var quality = 0.7;  // 默认图片质量为0.7
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 创建属性节点
                var anw = document.createAttribute("width");
                anw.nodeValue = w;
                var anh = document.createAttribute("height");
                anh.nodeValue = h;
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                ctx.drawImage(that, 0, 0, w, h);
                // 图像质量
                if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                    quality = obj.quality;
                }
                // quality值越小，所绘制出的图像越模糊
                var base64 = canvas.toDataURL('image/jpeg', quality );
                // 回调函数返回base64的值
                callback(base64);
            }
        }

    }
};
WY.getLocationImg = function(url , call){
    if(url.indexOf('/')===0){
        return call && call(url);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/file/download?url='+url, true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
        if(xhr.status === 200){
            var blob = xhr.response;
            var newUrl = URL.createObjectURL(blob);
            var img = new Image;
            img.src = newUrl;
            img.onload = function(){
                call && call(newUrl);
            };
        }
    };
    xhr.send();
};
WY.uploadFile = function(file ,options){
    options = options || {};
    var data = options.data || {};
    var call = options.done;
    var formData = new FormData();
    formData.append(options.fileName || 'filename' , file);
    for(var i in data){
        formData.append(i , data[i]);
    }
    WY.loading(1);
    $.ajax({
        url : options.url || '/file/upload',
        type : "POST",
        data : formData,
        dataType:"json",
        cache:false,
        timeout:options.timeout || 60000,
        processData : false,
        contentType : false,
        errorText:'上传失败',
        success:function(o){
            WY.loading(0);
            if(call)call(o);
        },
        error:function(o){
            WY.loading(0);
            if(call)call(o);
        }
    });
};