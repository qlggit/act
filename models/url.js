var apiUrl = useConfig.yqsapi ;
var h5Url = useConfig.h5Api ;
module.exports = {
    file:{
        upload:h5Url + '/file/upload',
        uploads:h5Url + '/file/uploads',
    },
    user:{
        add:h5Url + '/server/user/add',
    }
};