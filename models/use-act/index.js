
module.exports = {
    init:function(call){
        require('./vote')(this);
        require('./vote-user')(this);
        call && call();
    },

};