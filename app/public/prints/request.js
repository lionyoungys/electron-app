(function (window) {
    var r = {};
    r.post = function (url, param, callback) {
        if ("object" !== typeof param) throw new Error('该方法第二个参数必须是一个对象!');
        var xhr = new XMLHttpRequest(), fd = new FormData();
        xhr.open('POST', url, true);
        for (var k in param) {
            if ('object' === typeof param[k]) {
                param[k] instanceof Blob && fd.append(k, param[k], k);
            } else {
                fd.append(k, param[k]);
            }
        }
        xhr.send(fd);
        xhr.onreadystatechange = function () {
            if (4 == xhr.readyState && "function" === typeof callback) {
                var response = null;
                try {
                    response = JSON.parse(xhr.responseText);
                } catch (e) {
                    response = xhr.responseText;
                }
                callback(response);
            }
        }
    }
    window.R = r;
})(window);