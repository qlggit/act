//admin 1234yqs_admin
module.exports = {
    "port":3006,
    debug:0,
    "h5Api":"http://192.168.1.119:3002",
    apiUrl:'http://192.168.1.122:8012',
    "wechatLoginUrl":'http://h5.yukew.com/wechat/entrance/test?port=3006&host=192.168.1.119',
    wechatJssdkUrl:'http://h5.yukew.com/wechat/jssdk/test?port=3006',
    "log4js":{
        "customBaseDir" :"/logs/",
        "customDefaultAtt" :{
            "type": "dateFile",
            "absolute": true,
            "alwaysIncludePattern": true
        },
        "appenders": [
            {"type": "console", "category": "console"},
            {"pattern": "debug/yyyyMMdd.log", "category": "logDebug"},
            {"pattern": "info/yyyyMMdd.log", "category": "logInfo"},
            {"pattern": "warn/yyyyMMdd.log", "category": "logWarn"},
            {"pattern": "err/yyyyMMdd.log", "category": "logErr"}
        ],
        "replaceConsole": true,
        "allConsole":true,
        "levels":{ "logDebug": "DEBUG", "logInfo": "DEBUG", "logWarn": "DEBUG", "logErr": "DEBUG"}
    },
    dbOptions:{
        host:'120.27.213.0',
        port:'27017',
        dbname:'act'
    },
    mysqlOptions:{
        host:'127.0.0.1',
        user:'root',
        password :'mysqltest',
        database :'yukew'
    },
    // mysqlOptions:{
    //     host:'rm-uf6f0pnlca8085p8zo.mysql.rds.aliyuncs.com',
    //     user:'root',
    //     password :'CQyuke000!',
    //     database :'yukeh5'
    // },
};

