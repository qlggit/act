var Mysql = require('mysql');
var mysql = {
    init:function(call){
        this.connect(call);
    },
    connect:function(call){
        var mysqlOptions = useConfig.mysqlOptions;
        var that = this;
        this.connection = Mysql.createConnection({
            host     : mysqlOptions.host,
            user     : mysqlOptions.user,
            password :mysqlOptions.password,
            database : mysqlOptions.database,
            connectTimeout:10 * 1000,
        });
        this.connection.on('error', function(err){
            that.error(err);
        });
        this.connection.connect(function(err){
            call && call(err);
            that.connection.query('SET NAMES utf8mb4');
            that.error(err);
        });
    },
    error:function(err){
        if(err)console.error(err);
        if (err) {
            //断开自动重连
            if(err.code === 'PROTOCOL_CONNECTION_LOST') {
                this.connect();
            }
        }else{

        }
    },
    query:function(sql , call){
        var that = this;
        console.log(sql);
        this.connection.query(sql , function(err , rows , fields){
            if(err){
                console.error(err);
                //超时
                if(err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR'){
                    that.connect(function(err){
                        that.query(sql,call);
                    });
                    return false;
                }
                //意外的链接不上
                if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED'){
                    that.connect();
                }
            }else{
                that.turnKeyData(rows);
            }
            call && call(err , that.toObject(rows) , fields);
        });
    },
    search:function(options , call){
        var sql;
        if(typeof options === 'string')sql = options;
        else if(options.sql)sql = options.sql;
        this.query(sql , function(err , rows , fields){
            call && call(err , rows , fields);
        });
    },
    searchOne:function(options , call){
        var sql;
        if(typeof options === 'string')sql = options;
        else if(options.sql)sql = options.sql;
        this.query(sql , function(err , rows , fields){
            call && call(err , rows && rows[0] , fields);
        });
    },
    searchAll:function(options , call){
        var sql;
        var pageSize = options.pageSize || 20;
        var page = options.page || 0;
        page -= 0;
        if(typeof options === 'string')sql = options;
        else if(options.sql)sql = options.sql;
        sql += ' limit ' + ([page * pageSize , (page+1) * pageSize].join());
        var that = this;
        this.query(sql , function(err , rows , fields){
            if(err){
                call && call({
                    code:1,
                    err:err
                });
            }
            else that.count(options.count,function(e , d){
                if(e){
                    call&&call({
                        code:1,
                        err:err
                    })
                }else{
                    d = d[0];
                    var rt = {
                        code:0,
                        data:rows,
                        pageData:{}
                    };

                    var pageData = rt.pageData;
                    if(d){
                        pageData.allCount = d.allNumber;
                        pageData.allPage = Math.ceil(pageData.allCount/ pageSize);
                        pageData.firstPage = page === 0;
                        pageData.lastPage = pageData.allPage === 0 || page === pageData.allPage - 1;
                    }
                    call && call(rt);
                }
            });
        });
    },
    count:function(options , call){
        var sql;
        if(typeof options === 'string')sql = options;
        else if(options.sql)sql = options.sql;
        this.query('select count(1) all_number ' + sql , function(err , rows , fields){
            call && call(err , rows && rows[0], fields);
        });
    },
    sum:function(options , call){
        var sql;
        if(typeof options === 'string')sql = options;
        else if(options.sql)sql = options.sql;
        this.query('select sum('+options.sum+') sum_number ' + sql , function(err , rows , fields){
            call && call(err , rows , fields);
        });
    },
    add:function(options , call){
        var sql;
        if(typeof options === 'string')sql = options;
        else if(options.sql)sql = options.sql;
        this.query(sql , function(err , rows , fields){
            call && call(err , rows , fields);
        });
    },
    update:function(options , call){
        var sql;
        if(typeof options === 'string')sql = options;
        else if(options.sql)sql = options.sql;
        this.query(sql , function(err , rows , fields){
            call && call(err , rows , fields);
        });
    },
    del:function(options , call){
        var sql;
        if(typeof options === 'string')sql = options;
        else if(options.sql)sql = options.sql;
        this.query(sql , function(err , rows , fields){
            call && call(err , rows , fields);
        });
    },
    turnKeyData:function(data){
        var that = this;
        if(data){
            if(Array.isArray(data)){
                data.forEach(function(a , i){
                    data[i] = that.turnKeyData(a);
                });
            }else{
                for(var i in data){
                    if(useCommon.isSqlKey(i)){
                        data[useCommon.turnSqlKey(i)] = data[i];
                        delete data[i];
                    }
                }
            }
        }
        return data;
    },
    toObject:function(data){
        var that = this;
        if(data){
            if(Array.isArray(data)){
                data.forEach(function(a , i){
                    data[i] = that.toObject(a);
                });
            }else{
                return Object.assign({},data);
            }
        }
        return data;
    }
};
module.exports = mysql;