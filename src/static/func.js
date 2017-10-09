/**
 * js原型函数库文件
 * @author yangyunlong
 */
(() => {
    /**
     * 判断字符串是否在指定数组里
     * @param array 数组
     * @return ret 索引值/-1
     */
    String.prototype.inArray = function(array) {
        let ret = -1,
            len = array.length;
        if (len > 0) {
            for (var i = 0;i < len;++i) {
                if (array[i] == this) {
                    ret = i;
                    break;
                }
            }
        }
        return ret;
    };
    /**
     * 判断字符串是否在指定key的对象数组中
     * @param array 数组
     * @param key 键 
     * @return ret 索引值/-1
     */
    String.prototype.inObjectArray = function(array, key) {
        let ret = -1,
            len = array.length;
        if (len > 0) {
            for (var i = 0;i < len;++i) {
                if (this == array[i][key]) {
                    ret = i;
                    break;
                }
            }
        }
        return ret;
    };

    /**
     * 参数字符串转对象
     * @return object
     */
    String.prototype.paramToObject = function () {
        let paramArr = this.split('&'),
            len = paramArr.length;
        var obj = {},tempArr;
        if (len > 0) {
            for (var i = 0;i < len;++i) {
                tempArr = paramArr[i].split('=');
                obj[tempArr[0]] = decodeURIComponent(tempArr[1]);
            }
        }
        return obj;
    }

    /**
     * base64装二进制
     * @return Blob
     */
    String.prototype.base64toBlob = function () {
        var splitArray = this.split(','),    //分割base64数据的头与内容
            byteString = atob(splitArray[1]),    //base64解码
            mimeString = splitArray[0].split(':')[1].split(';')[0],    //data:image/png;base64，获取mime类型
            bufferSize = byteString.length,    //获取数据的大小
            buffer = new ArrayBuffer(bufferSize),    //创建同等于数据大小的内存区域
            dataView = new Uint8Array(buffer);    //创建一个8位无符号整数，长度1个字节的数据视图，并分配buffer
        for (var i = 0; i < byteString.length; i++) {
            dataView[i] = byteString.charCodeAt(i);    //获取每个字节Unicode编码并追加数据视图数组
        }
        return new Blob([buffer], {type: mimeString});    //返回原数据类型对象
    };
})();
