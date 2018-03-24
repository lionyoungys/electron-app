/**
 * 接口数据函数对象封装
 * @author yangyunlog
 */
const axios = require('axios');
const api = {
    //host:"http://clean.shuxier.com",    //生产环境域名
    host:"http://xiyi.wzj.dev.shuxier.com",    //测试环境域名
    connect:"mapi1_0_6/communication/connect",    //订单即时通知长链接接口
};
/**
 * 获取指定成员属性的url
 * @param uri 指定成员属性
 * @return string url
 */
api.U = function(uri) {return (this.host + '/' + this[uri])};
    
/**
 * 创建数据对象
 * @param object 数据对象
 * @return object 数据对象
 */
api.D = function (object) {
    const fd = new FormData();
    if ('object' === typeof object) {
        for (let k in object) {
            if ('object' === typeof object[k]) {
                object[k] instanceof Blob && fd.append(k, object[k], k);
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
api.V = function(object) {return ('object' === typeof object && 'undefined' !== typeof object.code && 0 == object.code)}

/**
 * 数据请求
 * @param uri 指定成员属性
 * @param object 数据对象
 * @param success 请求成功回调函数
 * @param fail 请求失败回调函数
 * @return void
 */
api.post = function(uri, object, success, fail) {
    axios.post(this.U(uri), this.D(object))
    .then(response => {'function' === typeof success && success(response)})
    .catch(error => {'function' === typeof fail && fail(error)});
}