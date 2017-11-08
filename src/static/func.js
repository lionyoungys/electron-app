/**
 * js原型函数库文件
 * @author yangyunlong
 */
((window) => {
    //去除字符串中的空字符；
    String.prototype.trim = function () {return this.replace(/(^\s*)|(\s*$)/g,'');};
    /**
     * 判断字符串是否在指定数组里
     * @param array 数组
     * @return ret 索引值/-1
     */
    Number.prototype.inArray = 
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
            for (let i = 0;i < len;++i) {
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
            for (let i = 0;i < len;++i) {
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
        let splitArray = this.split(','),    //分割base64数据的头与内容
            byteString, mimeString;
        if (splitArray.length > 1) {
            byteString = atob(splitArray[1]);    //base64解码
            mimeString = splitArray[0].split(':')[1].split(';')[0];    //data:image/png;base64，获取mime类型
        } else {
            byteString = atob(splitArray[0]);
            mimeString = 'image/jpg';
        }
        let bufferSize = byteString.length,    //获取数据的大小
            buffer = new ArrayBuffer(bufferSize),    //创建同等于数据大小的内存区域
            dataView = new Uint8Array(buffer);    //创建一个8位无符号整数，长度1个字节的数据视图，并分配buffer
        for (let i = 0; i < byteString.length; i++) {
            dataView[i] = byteString.charCodeAt(i);    //获取每个字节Unicode编码并追加数据视图数组
        }
        return new Blob([buffer], {type: mimeString});    //返回原数据类型对象
    };

    /**
     * 数组／对象列表值变为数值型
     * @return Array retArr
     */
    Array.prototype.toNumberArray = function() {
        let len = this.length, retArr = [];
        if (len > 0) {
            for (let i = 0;i < len;++i) {
                retArr.push(isNaN(this[i]) ? 0 : this[i] * 1);
            }
        }
        return retArr;
    }

    Array.prototype.filtration = function(value) {
        let retArr = this;
        console.log(retArr);
        if ('string' === typeof value) {
            let index = value.inArray(retArr);
            if (-1 !== index) retArr.splice(index,1);
        } else if ('object' === typeof value) {
            let len = value.length;
            for (let i = 0;i < len;++i) {
                let index = value[i].inArray(retArr);
                if (-1 !== index) retArr.splice(index,1);
            }
        }
        console.log(retArr);
        return retArr;
    }

    
    /**
     * 数值或数值字符串转成百分数字符串
     * @return String
     */
    Number.prototype.toPercent = String.prototype.toPercent = function() {return (this * 100) + '%'}

    /**
     * 时间戳格式化
     * @param format 格式化方式 date time datetime
     * @param partition 日期分割符
     * @return 日期字符串
     */
    Number.prototype.dateFormat = function(format, partition) {
        let fromDate = new Date(this);
        if ('string' !== typeof partition || '' === partition) partition = '-';
        const date = fromDate.getFullYear() + partition + (fromDate.getMonth() + 1) + partition + fromDate.getDate();
        const time = fromDate.getHours() + ':' + fromDate.getMinutes() + ':' + fromDate.getSeconds();
        let retDate = date + ' ' + time;
        if ('undefined' !== typeof format) {
            switch(format)
            {
                case 'date':
                    retDate = date;
                break;
                case 'time':
                    retDate = time;
                break;
            }
        }
        return retDate;
    }


    var f = {};
    /**
     * 计算多数值之和,准确度为小数点后两位
     * @param (...) 数值
     * @return sum 和
     */
    f.sum = function() {
        const count = arguments.length;
        if (0 === count) return 0;
        if (1 === count) return Number(arguments[0]);
        var sum = 0;
        for (var i = 0;i < count;++i) {
            sum += Math.floor(Number(arguments[i]) * 100);
        }
        return (sum / 100);
    }

    /**
     * 计算多数值之差,准确度为小数点后两位
     * @param (...) 数值1 - 数值n
     * @return difference 差
     */
    f.difference = function() {
        const count = arguments.length;
        if (0 === count) return 0;
        if (1 === count) return (arguments[0] * 1);
        var difference = arguments[0] * 100;
        for (var i = 1;i < count;++i) {
            difference -= arguments[i] * 100;
        }
        return (difference / 100);
    }

    /**
     * 判断值是否存在且赋值
     * @return boolean
     */
    f.isSet = function (value) {
        if ('undefined' === typeof value || null === value || '' === value || 0 == value) return false;
        return true;
    }

    f.arrayMerge = function() {
        const count = arguments.length;
        if (count < 2) return arguments[0];
        let retArr = [], tempLen;
        for (let i = 0;i < count;++i) {
            tempLen = arguments[i].length;
            for (let j = 0;j < tempLen;++j) {
                retArr.push(arguments[i][j]);
            }
        }
        return retArr;
    }
    /**
     * 获取当前日期时间
     * @param format 格式化方式
     * @return currentDate
     */
    f.currentDate = function (format) {
        let currentDate = new Date();
        if ('undefined' !== typeof format) {
            let date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
            let time = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
            switch (format) {
                case 'date':
                    currentDate = date;
                break;
                case 'time':
                    currentDate = time;
                break;
                case 'datetime':
                    currentDate = date + ' ' + time;
                break;
            }
        }
        return currentDate;
    }
    window.func = f;
})(window);
