/**
 * 接口数据函数对象封装
 * @author yangyunlog
 */
(function(window){
    var a = {};
    /**
     * 获取指定成员属性的url
     * @param uri 指定成员属性
     * @return string url
     */
    a.U = function(uri) {return this.host + this[uri];};

    /**
     * 创建数据对象
     * @param object 数据对象
     * @return object 数据对象
     */
    a.data = function (object) {
        var fd = new FormData();
        if ('object' === typeof object) {
            for (var k in object) {
                if (typeof object[k] === "object") {    //判断是否为文件对象
                    fd.append(k, object[k].file, object[k].name);
                } else {
                    fd.append(k, object[k]);
                }
            }
        }
        return fd;
    }

    /**
     * response 数据验证
     * @param object response
     * @return boolean true or false
     */
    a.verify = function(object) {
        if (0 === object.retcode || '0' === object.retcode) return true;
        return false 
    }

    window.api = a,window.axios = require('axios');
})(window);