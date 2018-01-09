/**
 * js原型函数库文件
 * @author yangyunlong
 */
((window) => {
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
