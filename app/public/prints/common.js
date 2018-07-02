(function(window) {
    const {ipcRenderer} = require('electron');
    String.prototype.add = 
    Number.prototype.add = function() {
        var len = arguments.length
        ,   that = parseFloat(this);
        if (isNaN(that)) that = 0;
        if (len < 1) return that;
        var precision = 1000000
        ,   value = Math.floor(that * precision)
        ,   temp;
        for (var i = 0;i < len;++i) {
            temp = parseFloat(arguments[i]);
            value += Math.floor( (isNaN(temp) ? 0 : temp) * precision);
        }
        return (value / precision);
    }
    Node.prototype.show = function() {this.style.display = '';}
    Node.prototype.hidd = function() {this.style.display = 'none';}
    var c = {
        GET:{},
        init:function(func) {    //初始化函数
            var str = window.location.search.substring(1);    //获取url的get参数
            if ('' != str) {
                var arr = str.split('&')
                ,   len = arr.length;
                if (len > 0) {
                    var temp;
                    for (var i = 0;i < len;++i) {
                        temp = arr[i].split('=');
                        if ('' != temp[0]) c.GET[temp[0]] = decodeURIComponent(temp[1]);
                    }
                }
            }
            if ('function' === typeof func) window.onload = func;
        },
        barcode:function(elem, code) {JsBarcode(elem, code, {displayValue:false, width:2, height:30})},    //依赖JsBarcode
        print:function() {ipcRenderer.send('print', localStorage.getItem('printer'));},
        id:function(id) {return document.getElementById(id)},
        className:function(className) {return document.getElementsByClassName(className)},
        tag:function(tag) {return document.getElementsByTagName(tag)},
        isNode:function(node) {return 'object' === typeof node && node instanceof Node},
        isNodeList:function(nodeList) {return 'object' === typeof nodeList && nodeList instanceof NodeList},
        elem:function(elem) {
            if ('string' === typeof elem && '' !== elem) {
                return (elem.indexOf('#') === 0) ? this.id(elem.substring(1)) : ( (elem.indexOf('.') === 0) ? this.className(elem.substring(1)) : this.tag(elem) );
            } else if (this.isNode(elem) || this.isNodeList(elem)) {
                return elem;
            }
            return null;
        },
        inner:function(elem, value) {
            var node = this.elem(elem);
            if (this.isNode(node)) {
                node.innerHTML = value;
            } else if (this.isNodeList(node)) {
                var len = node.length;
                for (var i = 0;i < len;++i) {
                    node[i].innerHTML = value;
                }
            }
        },
        now:function() {
            var date = new Date();
            this.inner(
                '#now', 
                date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
            );
        },
        hidd:function(elem) {
            var node = this.elem(elem);
            this.isNode(node) && node.hidd();
        },
        show:function(elem) {
            var node = this.elem(elem);
            this.isNode(node) && node.show();
        },
        post:function (url, param, callback) {
            if ("object" !== typeof param) throw new Error('该方法第二个参数必须是一个对象!');
            var xhr = new XMLHttpRequest()
            ,   fd = new FormData();
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
    };
    window._ = c;
})(window);