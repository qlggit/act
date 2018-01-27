if(!Object.assign){
    Object.assign = $.extend;
}
//显示遮罩
useCommon.backHideWindow = function(options){
    options = options || {};
    if(!options.type || options.type == 'show'){
        var div = $('<div>').addClass('show-window-back show-back-hide-window');
        $('body').append(div);
        if(options.handler){
            div.click(options.handler);
        }
        div.css({
            zIndex:options.content.css('zIndex')?(options.content.css('zIndex') - 1):1000
        });
        return div;
    }else{
        var hideEle;
        if(options.backHideWindow){
            hideEle = options.backHideWindow;
            options.backHideWindow.remove();
        }
        else hideEle = $('.show-back-hide-window');
        hideEle.hide(1,function(){
            $(this).remove();
        });
    }
};
//显示简易弹窗
useCommon.showEasyWindow = function(options){
    var content = $(options.content);
    var handler = function(){
        if(options.done)options.done();
        $(options.content).hide();
        useCommon.backHideWindow({
            type:'hide',
            backHideWindow:content[0].backHideWindow,
            delay:options.delay
        });
    };
    if(options.type == 'hide'){
        return handler();
    }
    content.show();
    content[0].backHideWindow = useCommon.backHideWindow({
        content:content
    });
    content.find('.close-this-window-btn').click(function(){
        handler();
        return false;
    });
    var hasMainAble = !!content.find('.main').length;
    if(hasMainAble){
        content.find('.main').click(function(){return false;});
    }
    content.click(function(e){
        if(!options.hideAble){
            if(hasMainAble || e.target == this){
                handler();
            }
        }
    });
};
$.fn.showEasyWindow = function(type , hideAble , done){
    return this.each(function(){
        useCommon.showEasyWindow({
            content:this,
            type:type,
            hideAble:hideAble,
            done:done
        })
    });
};


(function(){
    var toastTimer;
    useCommon.toast = function(text , delay , call){
        var $toastWindow = $('.ms-toast-window');
        $toastWindow.show();
        $toastWindow.find('.text').text(text);
        if(isNaN(delay) || delay <=0)delay = 2000;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function(){
            call && call();
            $toastWindow.hide();
        } , delay);
    };
    var alertBackHide;

    useCommon.alert = function(options){
        if(typeof options !== 'object'){
            options = {
                content:options
            };
        }
        var $alertWindow = $('.ms-alert-window');
        if(typeof options.content !== 'object')options.content+='';
        if(typeof options.content === 'string')options.content = options.content.slice(0 , 100);
        $alertWindow.find('.ms-alert-content').html(options.content);
        $alertWindow.show();
        var $alertMain = $alertWindow.find('.ms-alert-main');
        alertBackHide = alertBackHide || useCommon.backHideWindow({
                content:$alertWindow
        });
        $alertWindow.find('.ms-alert-submit-btn').unbind('click').click(function(){
            if(options.done)if(options.done() === false)return false;
            setTimeout(function(){
                $alertWindow.hide()
            });
            useCommon.backHideWindow({
                type:'hide',
                backHideWindow:alertBackHide
            });
            alertBackHide = null;
        });

    };
    //
   useCommon.prompt = function(options){
       var $promptWindow = $('.prompt-window');
       $promptWindow.find('.prompt-title').text(options.title);
       $promptWindow.find('.prompt-input').val(options.value || '');
       $promptWindow.find('.prompt-input').attr('placeholder',options.placeholder || '请输入内容');
       $promptWindow.showEasyWindow();
       $promptWindow.find('.prompt-submit-btn').unbind('click').click(function(){
           if(options.done)if(options.done($promptWindow.find('.prompt-input').val()) === false)return false;
           setTimeout(function(){
               $promptWindow.showEasyWindow('hide');
           });
       });
    };
    //
   useCommon.confirm = function(options){
       var $confirmWindow = $('.confirm-window');
       $confirmWindow.find('.confirm-title').text(options.title || '继续？');
       $confirmWindow.find('.confirm-submit-btn').text(options.submitText ||'确定');
       $confirmWindow.find('.close-this-window-btn').text(options.cancelText ||'取消');
       $confirmWindow.showEasyWindow();
       $confirmWindow.find('.confirm-submit-btn').unbind('click').click(function(){
           if(options.done)if(options.done() === false)return false;
           setTimeout(function(){
               $confirmWindow.showEasyWindow('hide');
           });
       });
       $confirmWindow.find('.close-this-window-btn').unbind('click').click(function(){
           $confirmWindow.showEasyWindow('hide');
           options.cancel && options.cancel();
       });
    };
})();

//获取元素内容
$.fn.__getValue = function(options){
    var _this = $(this[0]);
    if(_this.is('input,select,textarea,option')){
        return _this.val();
    }
    return _this.text();
};
//将form内容 转为json
$.fn.__serializeJSON = function(options){
    var o = {};
    options = $.extend({
        name : 'name',
        ignore : ''
    } , options);
    $(this).find('[' + options.name + ']').not(options.ignore).not('[type=file],button,[type=button]').each(function(){
        if((($(this).is('[type=checkbox]') || $(this).is('[type=radio]')) && !this.checked) || !$(this).attr(options.name)){
            return;
        }
        var val = $(this).__getValue();
        //过滤emoji表情  有BUG  弃用
        //val = val.replace(/ud83c[udc00-udfff]|ud83d[udc00-udfff]|[u2000-u2fff]/g,'');
        $.setArrayValue( o ,$(this).attr(options.name) , val);
    });
    return o;
};
$.fn.__formData = function(data , name , ignore){
    name = name || 'name';
    ignore = ignore || [];
    if(data)for(var key in data){
        if(ignore.indexOf(data[key]) !== -1)continue;
        this.find('[' + name + '="' + key + '"]').__setValue(data[key]);
    }
    return this;
};
$.setArrayValue = function (obj , key,val) {
    if(obj[key]){
        if(Array.isArray(obj[key]))obj[key].push(val);
        else obj[key] = [obj[key],val];
    }else obj[key] = val;
};
(function(){
    function setRadioValue(ele , val){
        var name = ele.attr('name');
        ele.prop('checked' ,false);
        if(!val)return;
        ele.filter('[value="' + val + '"]').prop('checked' ,true);
    }
    function setCheckboxValue(ele , val , split){
        var name = ele.attr('name');
        ele.prop('checked' ,false);
        if(!val) return;
        if(typeof val == 'string') val = val.split(split || ',');
        $.each(val ,function(i , o){
            ele.filter('[value="' + o + '"]').prop('checked' ,true);
        });
    }
    function setSelectValue(ele , val){
        var __val = [].slice.call(ele.children().map(function(){return $(this).val()}));
        if(__val.indexOf(val) != -1){
            ele.val(val);
        }else{
            ele.get(0).selectedIndex = 0;
        }
        ele.change();
    }
    $.fn.__setValue = function(val , split){
        return this.each(function(){
            if(!this)return;
            if(typeof val == 'number')val += '';
            if(val == null)val = '';
            var _this = $(this);
            if(_this.is('img')) return _this.attr('src',useCommon.concatImgUrl(val==null?'':val));
            if(_this.is('[type=radio]')) return setRadioValue(_this , val);
            else if(_this.is('[type=checkbox]')) return setCheckboxValue(_this , val , split);
            else if(_this.is('select')) return setSelectValue(_this , val);
            else if(_this.is('input,textarea')){
                return _this.val(val);
            }
            _this.html(val);
        });
    };
})();
$.fn.getSelectedText = function(){
    if(!this.is('select'))return '';
    var val = $(this).val();
    if(!val)return '';
    return this.find(':selected').text();
};
$.fn.dataTablePage = function(options){
    options.page -= 0;
    options.page = options.page || 1;
    options.allPage -= 0;
   return this.each(function(){
       if(!options.allPage){
           return $(this).hide();
       }
       $(this).show();
       var $this = $(this).addClass('clearfix').html('');
       $this.append('<span style="float: left;">共'+options.allNumber+'条数据,第'+options.page+'/'+options.allPage+'页</span>');
       var $fist = $('<span class="btn">').text('first').attr('num',1);
       var $last = $('<span class="btn">').text('last').attr('num',options.allPage);
       var $prev = $('<span class="btn">').text('prev').attr('num',options.page - 1);
       var $next = $('<span class="btn">').text('next').attr('num',options.page + 1);
       $this.append($fist)
           .append($prev);
       var min=1,max=options.allPage;
       if(options.allPage > 5){
           if(options.page > 3){
               $this.append($('<span class="more">...</span>'));
               min = options.page - 2;
               max = Math.min(max , options.page + 2)
           }
           if(options.allPage - 5 < options.page){
               min = options.allPage - 5;
               max = options.allPage;
           }
       }

       for(var i = min ; i <= max ; i ++ ){
           var $number = $('<span class="number"></span>').text(i).attr('num' , i);
           $this.append($number);
           if(i == options.page){
               $number.addClass('active');
           }
           else{
               $number.addClass('able');
           }
       }
       if(max < options.allPage){
           $this.append($('<span class="more">...</span>'));
       }
       $this.append($next)
           .append($last);
       if(options.page > 1){
           $fist.addClass('able');
           $prev.addClass('able');
       }
       if(options.page < options.allPage){
           $next.addClass('able');
           $last.addClass('able');
       }
       $this.find('.able').click(function(){
           console.log('click' , $(this).attr('num') - 0);
           if(options.done)options.done($(this).attr('num') - 0);
           return false;
       });
   });
};

$.fn.wyOn = function(event , selector , func){
    $(this).find(selector).bind(event,function(e){
        func.call(this,e);
        return false;
    });
    $(this).bind(event , function(e){
        var originalEvent = e.originalEvent;
        if(originalEvent){
            var path = originalEvent.path;
            if(path)for(var i=0,o;o=path[i++];){
                if(o && $(o).is(selector)){
                    return func.call(o,e);
                }
            }
        }

    });
};
/**
 * 将以base64的图片url数据转换为Blob
 * @param urlData
 *            用url方式表示的base64图片数据
 */
useCommon.convertBase64UrlToBlob = function (urlData , type){
    var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob( [ab] , {type : type});
};

useCommon.uuid = function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
/**
 * 字符串转JSON
 *
 */
useCommon.parseJSON = function (str){
    try{
        return JSON.parse(str);
    }catch(e){
        return null;
    }
};

/*
 * 日期格式化
 * */
useCommon.parseDate = function(date , format){
    format = format || 'Y-m-d H:i:s';//默认转换格式
    if(!(date instanceof Date)){
        if(date - 0){
            date -= 0;
        }
        date = new Date(date);
    }
    if(date == 'Invalid Date')return '';
    var time = {};
    time.Y = date.getFullYear();
    time.y = (time.Y + '').slice(2);
    time.m = this.stringPadStart(date.getMonth() + 1 , 2 , '0');
    time.d = this.stringPadStart(date.getDate() , 2 , '0');
    time.D = '星期' + '日一二三四五六'[date.getDay()];
    time.H = this.stringPadStart(date.getHours() , 2 ,'0');
    time.h = this.stringPadStart(time.H%12 , 2 , '0');
    time.i = this.stringPadStart(date.getMinutes() , 2 , '0');
    time.s = this.stringPadStart(date.getSeconds(), 2 ,0);
    time.w = this.stringPadStart(date.getMilliseconds(),3 ,0);
    time.a = time.H >= 12 ?'下午':'上午';
    return format.replace(/./g,function(a){
        return time[a] || a;
    });
};
/*
 * 获取对象的值 或者执行方法获取值
 * */
useCommon.getKeyValue = function(obj , key){
    if(typeof obj[key] == 'function'){
        return obj[key].apply(obj , [].slice.call(arguments , 2));
    }else return obj[key];
};
/*
 *在前补全字符串
 * */
useCommon.stringPadStart = function(str , len , split){
    if(str == null)str = '';
    str += '';
    if(str.length > len)return str;
    var _len = len - str.length;
    return Array(_len + 1).join(split).slice(0 , _len) + str;
};
/*
 *在后补全字符串
 * */
useCommon.stringPadEnd = function(str , len , split){
    if(str == null)str = '';
    str += '';
    if(str.length > len)return str;
    var _len = len - str.length;
    return  str + Array(_len + 1).join(split).slice(0 , _len);
};
//sha256加密
useCommon.SHA256 = function(s){
    var chrsz = 8;
    var hexcase = 0;
    function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
    function R (X, n) { return ( X >>> n ); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
    function core_sha256 (m, l) {
        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
        for ( var i = 0; i<m.length; i+=16 ) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];
            for ( var j = 0; j<64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }
            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }
    function str2binb (str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
        }
        return bin;
    }
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }
    function binb2hex (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
                hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8 )) & 0xF);
        }
        return str;
    }
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
};
useCommon.parse = function(data){
    if(typeof data !== 'string')return data;
    if(!isNaN(data))return data;
    try{
        return JSON.parse(data);
    }catch (e){
        return data;
    }
};
useCommon.stringify = function(data){
    if(typeof data !=='object')return data;
    try{
        return JSON.stringify(data) + '';
    }catch (e){
        return data + '';
    }
};
useCommon.serialize = function(data){
    var str = '';
    if(data)for(var key in data){
        var o = data[key];
        if(o != null){
            if(str)str+='&';
            str += key + '=' + encodeURIComponent(o);
        }
    }
    return str;
};
useCommon.getHrefData = function(href , notDecode){
    var param = href.split('?');
    param = param[1] || param[0];
    var rt = {};
    param && param.split('&').forEach(function(a){
        var index =  a.indexOf('=');
        var d = a.slice(index + 1);
        if(index > 0)rt[a.slice(0 , index)]  = notDecode?d:decodeURIComponent(d);
    });
    return rt;
};
useCommon.concatImgUrl = function(url){
    if(!url)return url;
    if(/^http/.test(url))return url;
    return resJson.imgUrl + url;
};

useCommon.sumTime = function(time , format){
    var timeData = this.sumDate(time);
    if(timeData.s){
        timeData.s += '秒';
    }
    if(timeData.i){
        timeData.i += '分';
    }
    if(timeData.h){
        timeData.h += '时';
    }
    if(timeData.d){
        timeData.d += '天';
    }
    format = format || 'dhis';
    return format.replace(/./g , function(a){
        return timeData[a];
    });
};
useCommon.sumDate = function(time , format){
    var timeData = {
        d:'',
        s:'',
        h:'',
        i:''
    };
    time = Math.floor(time / 1000);
    var more;
    if(more = time % 60 ){
        timeData.s = more;
        time -= more;
    }
    time /= 60;
    if(more = time % 60 ){
        timeData.i = more;
        time -= more;
    }
    time /= 60;
    if(more = time % 24 ){
        timeData.h = more;
        time -= more;
    }
    time /= 24;
    if(time > 1){
        timeData.d = time;
    }
    return timeData;
};
useCommon.sum = function(arr , func){
    func = func || function(a){return a};
    var sum = 0;
    arr.forEach(function(a , i){
        sum += func(a , i) - 0;
    });
    return sum;
};
window.WY = {};
(function(){
    var handlers = {};
    var readyHandler = {};
    WY.ready = function(type ,func , done){
        var handler = readyHandler[type] = readyHandler[type] || {};
        if(typeof func == 'function'){
            WY.bind('ready-' + type , func);
            if(handler.isReady){
                func && func(handler.data, handler.done);
                return false;
            }
        }else{
            handler.data = func;
            handler.done = done;
            handler.isReady = true;
            WY.trigger('ready-' + type , handler.data , handler.done);
            if(handler.once){
                handler.once.forEach(function(a){
                    try{
                        a(handler.data , handler.done);
                    }catch (e){
                        console.error(e);
                    }
                })
                handler.once = [];
            }
        }
    };
    WY.readyOnce = function(type ,func){
        var handler = readyHandler[type] = readyHandler[type] || {};
        if(typeof func == 'function'){
            if(handler.isReady){
                func && func(handler.data , handler.done);
                return false;
            }else{
                handler.once = handler.once || [];
                handler.once.push(func);
            }
        }
    };
    WY.bind = function(event , func){
        console.log('bind --' +event );
        if(func){
            var handler = handlers[event] = handlers[event] || [];
            if(handler.indexOf(func) >= 0){
                return false;
            }
            handler.push(func);
        }
    };
    WY.unbind = function(event , func){
        if(func){
            var handler = handlers[event];
            if(handler){
                var index = handler.indexOf(func);
                if(index >= 0){
                    handler.splice(index , 1);
                }
            }

        }else{
            handlers[event] = [];
        }
    };
    WY.trigger = function(event , data , options){
        console.log('trigger --' +event );
        var handler = handlers[event];
        var nextStatus;
        handler && handler.forEach(function(a){
            try{
                if(a(data , options) === false)nextStatus = false;
            }catch (e){
                console.error(e);
            }
        });
        if(nextStatus === false)return false;
        if(event.indexOf('.') > 0){
            WY.trigger(event.replace(/\.\w+$/,'') , data , options);
        }
    };
    var eventHandler = ['click','change'];
    function thisBind($content){
        eventHandler.forEach(function(o){
            $($content).on(o , '[wy-'+o+']' , function(){
                WY.trigger($(this).attr('wy-'+o));
                return false;
            });
        });
    }
    WY.bind('modal-load',thisBind);
    $(function(){
        var $page = $('.act-page');
        thisBind($page[0]?$page:'body');
    });
})();


(function(){
    var $shareWindow ;
    WY.bind('wy-concern' , function(){
        $shareWindow = $shareWindow || $('.wy-share-window');
        $shareWindow.showEasyWindow();
    });
})();
/**
 */
var Dictionary = {
	// 字典缓存
	cache: {

	},
	/**
	 * 根据数据字典编码获得对应字典项信息
	 * 
	 * @param {}
	 *            code 字典编码
	 * @param {}
	 *            onSuccess 获取成功回调函数
	 * @param {}
	 *            onFault 获取失败回调函数
	 * @param {}
	 *            onComplete 获取完成回调函数
	 */
	get: function(code, onSuccess, onFault, onComplete) {
		var _this = this;
		// 判断字典编码是否存在
		if (!code) {
			if ($.isFunction(onFault)) {
				onFault();
			}
			return null;
		}
		// 判断是否缓存字典信息
		if (_this.cache.hasOwnProperty(code)) {
			var data = _this.cache[code] ||  {};
			if ($.isFunction(onSuccess)) {
				onSuccess(data);
			}
			if ($.isFunction(onComplete)) {
				onComplete();
			}
            return data;
		}
	},
	
	/**
	 * 获得字典对应字典项文本
	 * @param {} code	字典编码
	 * @param {} value	字典项编码
	 */
	text: function(code, value) {
		var _this = this;
		// 字典项文本
		var libarayText = '';
		// 判断字典编码是否存在
		if (!code || !value) return libarayText;
		// 判断是否缓存字典信息
		if (_this.cache.hasOwnProperty(code) && _this.cache[code].hasOwnProperty(value)) {
			libarayText = _this.cache[code][value] || '';
		}
		return libarayText;
	},
	
	/**
	 * 加载字典到下拉框对象中，加载包含data-dictionary属性的项
	 * @param {} $dictionary	待加载字典对象[可选]
	 * 				data-dictionary/data-dictionary-key/data-dictionary-default 默认配置，分别表示字典编码、项值对应键、初始化默认项值
	 * @param {} complete		全部加载完成执行
	 */
	load: function() {
		var _this = this;
		
		// 解析参数
		var $dictionary = $('[data-dictionary]'), complete = null;
		if (arguments.length > 0) {
			if (arguments[0].jquery) {
				$dictionary = arguments[0];
				complete = arguments[1];
			} else {
				complete = arguments[0];
			}
		}

		// 判断需加载字典个数
		var surplusLoads = $dictionary.length;
		// 判断是否已经全部加载
		if (surplusLoads == 0 && $.isFunction(complete)) {
			complete();
			return;
		}
		
		/**
		 * 加载字典项
		 * @param {} domEl DOM节点
		 */
		var loadOptions = function(domEl) {
			// 获得jQuery对象
			var $this = $(domEl);
			// 获得字典编码
			var code = $this.attr('data-dictionary') ||  $this.attr('name') || '';
			// 项值对应键，编码：0，文本：1，默认使用0
			var key = $this.attr("data-dictionary-key");
			// 获得初始默认值
			var defaultValue = $this.attr("data-dictionary-default");
			
			/**
			 * 获得字典项成功回调函数
			 * @param {Array} datas 字典项信息
			 */
			var onSuccess = function(data) {
				if($this.find('option').length > 1)return false;
				for (var id in data) {
					var text = data[id];
					// 创建字典项
					var $option = $('<option/>').val(id).html(text);
					// 判断是否使用文本做为值
					if (key == '1') {
						$option.val(text);
					}
					// 追加字典项到下拉框中
					$this.append($option);
				}
				// 判断是否默认选中项
				if (!(defaultValue)) {
					$this.children('option[value="' + defaultValue + '"]')
							.prop('selected', true).siblings('option').prop(
									'selected', false);
				}
                $this.trigger('change');
			};
			
			/**
			 * 加载完成执行
			 */
			var onComplete = function() {
				surplusLoads--;
				// 判断是否已经全部加载
				if (surplusLoads == 0 && $.isFunction(complete)) {
					complete();
				}
			};
			
			// 获得字典数据，并设置到下拉框中
			_this.get(code, onSuccess, null, onComplete);
		};
		
		// 加载所有字典项
		$dictionary.each(function(){
			loadOptions(this);
		});
	}
};
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
$(function(){
    $('input').attr('autocomplete','off');
    $('[setName]').change(function(){
        $($(this).attr('setName')).val($(this).val() && $(this).find(':selected').text() || '');
    });
    $('body').wyOn('click','.active-item',function(){
       if($(this).hasClass('active'))return false;
       $(this).addClass('active').siblings().removeClass('active');
       WY.trigger('active-item',$(this));
    });
    $('body').wyOn('click','.checkbox-item',function(){
        $(this).toggleClass('active');
        WY.trigger('checkbox-item',$(this));
    });
    $('body').wyOn('change','[check-all]',function(){
       $('[check-one="'+$(this).attr('check-all')+'"]').prop('checked',this.checked);
        WY.trigger('check-all-one',$(this).attr('check-all'));
    });
    $('body').wyOn('change','[check-one]',function(){
        $('[check-all="'+$(this).attr('check-one')+'"]').prop('checked',!$('[check-one="'+$(this).attr('check-one')+'"]:not(:checked)').length);
        WY.trigger('check-all-one',$(this).attr('check-one'));
    });
    WY.bind('change-active-item',function($item){
        $item.addClass('active').siblings().removeClass('active');
    });
    WY.bind('active-item-bind',function($content){
        $content.find('.active-item').click(function(){
            if($(this).hasClass('active'))return false;
            $(this).addClass('active').siblings().removeClass('active');
            WY.trigger('active-item',$(this));
            return false;
        });
    });
    if($.fn.DateTimePicker)$('.date-picker-window').DateTimePicker(
        {
            dateFormat: "dd-MM-yyyy"
        });
    $('body').wyOn('click','[do-href-link]',function(){
        var href = $(this).attr('do-href-link');
        if(href)location.href = $(this).attr('do-href-link');
    })
});
window.resetImgUrl = function(url){
    url += '';
    return url.replace(/^http(s)?:/,'')
};
(function(){
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    window.browserClient = {
        trident: /(Trident)/i.test(ua), // IE内核
        presto: /(Presto)/i.test(ua), // opera内核
        webKit: /(AppleWebKit)/i.test(ua), // google内核
        gecko: /(Trident)/i.test(ua), // 火狐内核
        ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        android: /(Android|Linux)/i.test(ua),
        iPhone: /(iPhone|Mac)/i.test(ua),
        iPad: /(iPad)/i.test(ua),
        wechat: /(MicroMessenger)/i.test(ua),
        qq: /(QQ)/i.test(ua),
        pc: !/(Android|iPhone|iPod|iOS|SymbianOS|Windows Phone)/i.test(ua),
        mobile: /mobile|tablet|ip(ad|hone|od)|android/i.test(ua),
        isIE: /MSIE|Trident/i.test(ua)
    };
    window.hrefData = useCommon.getHrefData(location.href);

    WY.clientWidth = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
    WY.clientHeight = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    var fontSize = 100 * WY.clientWidth / 750;
    //pc处理
    if(WY.clientWidth > 750){
        fontSize = 50;
    }
    document.documentElement.style.fontSize = fontSize + 'px';
    WY.fontSizeScale = fontSize / 100;
    WY.getScaleSize = function(size){
        return size * WY.fontSizeScale;
    };
    WY.setTitle = function(title){
        WY.autoTitle = document.title;
        document.title = title;
    };
    WY.resetTitle = function(){
        document.title = WY.autoTitle || document.title;
    };
})();
window.onerror = function(err , url , line){
    try{
        errorLog({
            err:err,
            url:url ,
            line : line
        });
    }catch(e){

    }
};
window.errorLog = function(data){
    $.ajax({
        url:'common/log',
        notLog:true,
        data:data
    })
};
window.createSocket = function(handler){
    var socket = new WebSocket(wsHref);
    socket.onopen = function(event) {
        console.log('onopen');
        // 监听消息
        socket.onmessage = function(event) {
            var obj = useCommon.parse(event.data);
            console.log(obj);
            if(handler[obj.type]){
                handler[obj.type](obj);
            }
        };
        // 监听Socket的关闭
        socket.onclose = function(event) {
            if(handler.onclose)handler.onclose();
        };
        if(handler.init)handler.init(socket);
    };
    socket.onerror  = function(event){
        if(handler.onerror)handler.onerror();
    };
    return socket;
};
// md5
!function(a){"use strict";function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(this);
(function(){
    var isLoading;
    var $loadingWindow
    WY.loading = function(sts){
        if(sts === 0){
            isLoading = 0;
            if($loadingWindow)$loadingWindow.hide();
            return false;
        }
        $loadingWindow = $loadingWindow || $('.wy-loading-window');
        $loadingWindow.show();
        isLoading = 1;
        var width = 190,height = 65;
        function canvasLoading(canvas){
            canvas.width = width;
            canvas.height = height;
            var x = 67 , y = 94;
            var ctx = canvas.getContext('2d');
            var requestAnimationFrame = window.requestAnimationFrame || function(func){setTimeout(func , 16)};
            var start = 0;
            var startColor = '#ff0042',endColor = 'black';
            function createLinearGradient(){
                var grd=ctx.createLinearGradient(-width/2,0,width*3/2,width);
                grd.addColorStop((start)%1,startColor);
                grd.addColorStop((start+1/12)%1,startColor);
                grd.addColorStop((start+3/12)%1,endColor);
                grd.addColorStop((start+4/12)%1,endColor);
                grd.addColorStop((start+6/12)%1,startColor);
                grd.addColorStop((start+7/12)%1,startColor);
                grd.addColorStop((start+9/12)%1,endColor);
                grd.addColorStop((start+10/12)%1,endColor);
                grd.addColorStop((start+1)%1,startColor);
                return grd;
            }
            function draw(){
                ctx.clearRect(0,0,width,height);
                ctx.beginPath();
                ctx.strokeStyle = createLinearGradient();
                ctx.lineWidth = 3;
                ctx.moveTo(0,height/2);
                ctx.quadraticCurveTo(x,y,width,0);
                ctx.stroke();
                ctx.moveTo(0,height/2);
                ctx.quadraticCurveTo(x,height-y,width,height);
                ctx.stroke();
                start+=0.01;
                if(start>1)start-=1;
                requestAnimationFrame(function(){
                    if(isLoading)draw();
                });
            }
            draw();
        }
        canvasLoading($loadingWindow.find('canvas')[0]);
    };
})();
;(function(){
    var $messageWindow,messageSubmit;
    WY.bind('message-submit',function(){
        messageSubmit && messageSubmit($messageWindow);
    });
    WY.bind('message-window',function(options){
        if($messageWindow){
            setOptions(options);
        }else{
            WY.trigger('load-view' , options.view || 'window/message', function(view){
                $messageWindow = $(view);
                $messageWindow.appendTo('body');
                $messageWindow.find('.submit-btn').click(function(){
                    WY.trigger('message-submit');
                });
                setOptions(options);
            });
        }
    });
    function setOptions(options){
        $messageWindow.find('.title').text(options.title||'温馨提示');
        $messageWindow.find('.text').html('').append(options.content);
        $messageWindow.find('.submit-btn').text(options.submitText||'确定');
        messageSubmit = options.submit;
        $messageWindow.showEasyWindow();
        options.done && options.done($messageWindow);
    }

    WY.bind('raffle-message-window',function(options){
        options.view = 'window/raffle/message';
        WY.trigger('message-window',options)
    });
    WY.bind('message-hide',function(){
        $messageWindow && $messageWindow.showEasyWindow('hide');
    });
})();
function prop(obj , key , func){
  if(!obj.prototype[key]){
    Object.defineProperty(obj.prototype , key , {
      get:function(){
        return func
      },
    });
  }
}
prop(Number , 'toMoney' , function(){
  return this.toFixed(2) - 0;
});
prop(Number , 'turnMoney' , function(){
  return (this/100).toFixed(2);
});
prop(String , 'turnMoney' , function(){
  return (this/100).toFixed(2);
});
prop(Array , 'every' , function(func){
  for(var i=0;i<this.length;i++){
     if(func(this[i] , i) === false)return false;
  }
  return true;
});
prop(String , 'padStart' , function(num , split){
  split = split || ' ';
  return (Array(num + 1).join(split) + this).slice(-num);
});
prop(Number , 'padStart' , String.prototype.padStart);
if(!Object.assign)Object.assign = function(a , b){
  if(b)for(var i in b){
    if(b.hasOwnProperty(i))a[i] = b[i];
  }
};
prop(String , 'startTime' , function( time){
  if(this.length > 10)return this + '';
  return this + (time || ' 00:00:00');
});
prop(String , 'endTime' , function( time){
  if(this.length > 10)return this + '';
  return this + (time || ' 23:59:59');
});
prop(String , 'sortShow' , function( num ,split){
    num = num || 3;
  split = split || '...';
  if(this.length > num)return this.slice(0,num) + split;
  return this + '';
});
prop(Array , 'find' , function(func){
  for(var i=0;i<this.length;i++){
    if(func(this[i] , i) === true)return this[i];
  }
  return null;
});
prop(Array , 'findIndex' , function(func){
  for(var i=0;i<this.length;i++){
    if(func(this[i] , i) === true)return i;
  }
  return -1;
});

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
WY.ready('user-info',function(userInfo){
    sessionJson.userInfo = userInfo;
});
WY.ready('user-info',sessionJson.wechat_info);
(function(){
    var voteTimer;
    WY.bind('wy-vote' , function(data , call){
        voteTimer = setTimeout(function(){
            $.post('/vote/user/do',data,function(a){
                useCommon.toast(a.message);
                if(a.code === 0){
                    call && call();
                }
            });
        },100);

    });
})();
;(function(){
    var $autoWindow;
    WY.bind('modal-load' , function(content , options){
        content.parent().find('[modal-handler]').each(function(){
            var handler = $(this).attr('modal-handler');
            var $content = $(this);
            handler.split(',').forEach(function(one){
                WY.trigger('modal-handler-'+one, $content , options);
            });

        });
    });
    WY.bind('modal' , function(options){
        if(!$autoWindow){
            $autoWindow = $('.auto-modal-window');
        }else{
            $autoWindow.showEasyWindow('hide');
        }
        var $content = $autoWindow.find('.main');
        $content.html(options.content);
        WY.trigger('modal-load',$content.children() , options);
        $autoWindow.showEasyWindow('',options.hideAble);
        options.done && options.done($content.children());
    });
    WY.bind('modal-view' , function(url , options){
        options = options || {};
        WY.trigger('load-view' , url , function(view){
            if(typeof options ==='function'){
                options = {
                    done:options
                }
            }
            options.content = view;
            WY.trigger('modal',options);
        });
    });
    WY.bind('load-view' , function(url , call){
        if(url[0] !== '/'){
            url = '/common/view?view='+url;
        }
        $.get(url , function(view){
            call && call(view);
        });
    });
    WY.bind('modal-hide' , function(){
        WY.trigger('message-hide');
        if($autoWindow){
            $autoWindow.showEasyWindow('hide');
        }
    });
    $(function(){
        var modalLoad;
        var options;
        var $this;
        function load(){
            WY.trigger('modal-view',modalLoad,options);
        }
        $('body').wyOn('click','[modal-load]' , function(){
            $this = $(this);
            modalLoad = $this.attr('modal-load');
            options = useCommon.parse($this.attr('modal-options'));
            load();
            return false;
        });
        $('body').wyOn('click','.modal-hide' , function(){
            WY.trigger('modal-hide');
        });
        WY.bind('modal-handler-modal-hide',function($content){
            $content.click(function(){
                WY.trigger('modal-hide');
            });
        })
    });
})();
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


(function(){
	var validator = {
		required:{
			method:function(val){
				return val !== '' && val != null;
			},
			message:function(key){
				return key + ' is required';
			}
		},
		max:{
			method:function(val , param){
				return val - 0 <= param;
			},
			message:function(key , param){
				return key + ' 不能大于' + param;
			}
		},
		min:{
			method:function(val , param){
				return val - 0 >= param;
			},
			message:function(key , param){
				return key + ' 不能小于' + param;
			}
		},
		moreThen:{
			method:function(val , param){
				return val - 0 > param;
			},
			message:function(key , param){
				return key + ' 不能小于' + param;
			}
		},
		isInt:{
			method:function(val){
				return /^(\-)?\d+$/.test(val);
			},
			message:function(key, param , val){
				return key + ' 必须是整数 but ' + val;
			}
		},
		isNumber:{
			method:function(val){
				return !isNaN(val) && !/[a-z]/.test(val);
			},
			message:function(key, param , val){
				return key + ' 必须是数字 but ' + val;
			}
		},
		isMoney:{
			method:function(val){
				return /^\d+(\.\d{1,2})?$/.test(val);
			},
			message:function(key , param , val){
				return key + ' 必须是有效金额 but ' + val;
			}
		},
		length:{
			method:function(val , param){
				return val.length == param;
			},
			message:function(key , param){
				return key + '  length is ' + param;
			}
		},
		maxlength:{
			method:function(val , param){
				return val.length <= param;
			},
			message:function(key , param){
				return key + '  is too long , maxlength is ' + param;
			}
		},
		minlength:{
			method:function(val , param){
				return val.length >= param;
			},
			message:function(key , param){
				return key + '  is too short , minlength is ' + param;
			}
		},
		lengthRange:{
			method:function(val , param){
				if(!param.splice)param = param.split(',');
				return val.length >= param[0] && val.length <= param[1];
			},
			message:function(key , param){
				if(!param.splice)param = param.split(',');
				return key + '  is between  ' + param[0] + ' and ' + param[1];
			}
		},
		isPhone:{
			method:function(val){
				return /^1(3|4|5|7|8)(\d{9})$/.test(val);
			},
			message:function(key , param , val){
				return key + '需要正确的手机号格式 but ' + val;
			}
		},
		isDate:{
			method:function(val){
				if(val - 0 )val -= 0;
				return new Date(val) != 'Invalid Date';
			},
			message:function(key , param , val){
				return key + '必须可转化为日期 but ' + val;
			}
		},
		inArray:{
			method:function(val , param){
				if(param.constructor  != [].constructor ){
					param += '';
					param = param.split(',');
				}
				return param.indexOf(val) >= 0;
			},
			message:function(key , param , val){
				return '请输入正确的枚举值';
			}
		},
		forInData:{
			method:function(val , param){
				if(param){
					return val in param;
				}
			},
			message:function(key , param , val){
				return '请输入正确的枚举值';
			}
		},
		regExp:{
			method:function(val , param){
				return param.test(val);
			},
			message:function(key , param , val){
				return '请输入正确的格式';
			}
		},
		chinese:{
			method:function(val){
				return /^[\u4E00-\u9FA5\uf900-\ufa2d]+((\.|\·)?[\u4E00-\u9FA5\uf900-\ufa2d]+)+$/g.test(val);
			},
			message:function(){
				return '请输入正确的中文';
			}
		},
		isAllName:{
			method:function(val){
				return /^[\u4E00-\u9FA5\uf900-\ufa2d\w]+$/g.test(val);
			},
			message:function(){
				return '不允许特殊字符';
			}
		},
		isEnAndNum:{
			method:function(val){
				return /^[a-zA-Z0-9]+$/g.test(val);
			},
			message:function(){
				return '只允许英文字母和数字';
			}
		},
		isEqual:{
			method:function(val, param){
				return val == param;
			},
			message:function(val, param){
				return val + ' 与 ' + param + '不相同';
			}

		},
		isNotEqual:{
			method:function(val, param){
				return val != param;
			},
			message:function(val, param){
				return val + ' 与 ' + param + '不能相同';
			}

		},
		isIdCard:{
			method:function(val , param , ele){
				var CheckIdCard={
					//Wi 加权因子 Xi 余数0~10对应的校验码 Pi省份代码
					Wi:[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2],
					Xi:[1,0,"X",9,8,7,6,5,4,3,2],
					Pi:[11,12,13,14,15,21,22,23,31,32,33,34,35,36,37,41,42,43,44,45,46,50,51,52,53,54,61,62,63,64,65,71,81,82,91],
					//检验18位身份证号码出生日期是否有效
					//parseFloat过滤前导零，年份必需大于等于1900且小于等于当前年份，用Date()对象判断日期是否有效。
					brithday18:function(sIdCard){
						var year=parseFloat(sIdCard.substr(6,4));
						var month=parseFloat(sIdCard.substr(10,2));
						var day=parseFloat(sIdCard.substr(12,2));
						var checkDay=new Date(year,month-1,day);
						var nowDay=new Date();
						if (1900<=year && year<=nowDay.getFullYear() && month==(checkDay.getMonth()+1) && day==checkDay.getDate()) {
							return true;
						}
					},
					//检验校验码是否有效
					validate:function(sIdCard){
						var aIdCard=sIdCard.split("");
						var sum=0;
						for (var i = 0; i < CheckIdCard.Wi.length; i++) {
							sum+=CheckIdCard.Wi[i]*aIdCard[i]; //线性加权求和
						}
						var index=sum%11;//求模，可能为0~10,可求对应的校验码是否于身份证的校验码匹配
						if (CheckIdCard.Xi[index]==aIdCard[17].toUpperCase()) {
							return true;
						}
					},
					//检验输入的省份编码是否有效
					province:function(sIdCard){
						var p2=sIdCard.substr(0,2);
						for (var i = 0; i < CheckIdCard.Pi.length; i++) {
							if(CheckIdCard.Pi[i]==p2){
								return true;
							}
						}
					}
				};
				return /^\d{17}(\d|X|x)$/.test(val) && CheckIdCard.province(val)&&CheckIdCard.validate(val) || false;
			},
			message:function(val , param , ele){
				return '请输入正确的身份证号';
			}
		}
	};
	function validate(type , key , val , param){
		if(type in validator){
			if(!validator[type].method(val , param)){
				return validator[type].message(key , param , val);
			}
		}
	}
	/*
	 * 用于验证参数有效性
	 * */
	useValidate.validator = function(rules , params){
		var message;
		for(var key in rules){
			var sts = true;
			var rule = rules[key];
			if(rule.required){
				if(message = validate('required', key , params[key])){
					message = rule.requiredMessage || rule.message || message;
					break;
				}
			}
			if(validator.required.method(params[key])){
				delete rule.required;
				for(var type in rule){
					if(message = validate(type , key , params[key] , rule[type])){
						message = rule[type + 'Message'] || rule.message || message;
						sts = false;
						break;
					}
				}
			}
			if(!sts)break;
		}
		return {valid:!message,message:message};
	};
})();