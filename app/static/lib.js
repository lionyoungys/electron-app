'use strict';
(()=>{
    //去除字符串中的空格等；
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g,'');
    };
})();