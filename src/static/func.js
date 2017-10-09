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
})();
