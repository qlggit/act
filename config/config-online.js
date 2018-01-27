//admin 1234yqs_admin
module.exports = {
    debug:0,
    "h5Api":"http://h5.yukew.com",
    wechatLoginUrl:'http://h5.yukew.com/wechat/entrance/wxact',
    wechatJssdkUrl:'http://h5.yukew.com/wechat/jssdk/wxact',
    "log4js":{
        "customBaseDir" :"../logs/act/",
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
        host:'127.0.0.1',
        port:'27017',
        dbname:'act'
    },
    mysqlOptions:{
        host:'rm-uf6f0pnlca8085p8z.mysql.rds.aliyuncs.com',
        user:'root',
        password :'CQyuke000!',
        database :'yukeh5'
    },
};

