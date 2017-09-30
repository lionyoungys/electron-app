/**
 * 接口数据函数对象封装
 * @author yangyunlog
 */
(function(window){
    //"http://xiyi.wzj.dev.shuxier.com",    //测试域名
    //"http://clean.shuxier.com"            //正式域名
    var a = {
        //host:"http://clean.shuxier.com",    //生产环境域名
        host:"http://xiyi.wzj.dev.shuxier.com",    //测试环境域名
        login:"/app.php/Home/Login/login",    //登陆uri
        index:"/app.php/Home/Merchant/index",    //首页接口
        statusSwitchover:"/app.php/Home/Merchant/state_change",    //店铺状态切换 1-营业中 3-休息中
        orderHandle:"/app.php/Home/Merchant/orderHandle",    //订单处理接口 state:0-待处理;1-代取;2-待清洗;3-清洗中;4-代送达
        orderCancel:"/app.php/Home/Merchant/cause",    //取消订单接口
        getItems:"/app.php/Home/Merchant/mod_item_add",    //获取商家项目列表 orderid-订单id
        addItems:"/app.php/Offline/Merchant/item_add",    //添加项目接口:val json:orderid type price itemcount
        done:"/app.php/Home/Merchant/wancheng",    //送件完成 id 订单id
        editorPrice:"/app.php/Home/Merchant/edit_price",     //编辑价格 id 订单id
        modifySpecial:"/app.php/Home/Merchant/mod_gongyi",    //工艺加价修改接口 special 价格 special_comment 备注 id 项目id
        modifyHedging:"/app.php/Home/Merchant/hedging",     //保值金额  hedging 输入价格除以20 id 项目id
        gotIt:"/app.php/Home/Merchant/shoujian",    //确认收件    id 订单id
        check:"/app.php/Home/Merchant/jiancha",    //衣物检查    id 订单id
        deleteImage:"/app.php/Home/Merchant/delImages",    //删除衣物检查图片 image 图片路径 orderid 订单id id 项目id
        checkImageUpload:"/app.php/Home/Merchant/imagesUpload",    //衣物检查图片上传接口  orderid 订单id id 项目id file 文件
        questionSubmit:"/app.php/Home/Merchant/note",    //问题描述提交接口 id 项目id item_note 问题描述以逗号分割的字符串
        colorSubmit:"/app.php/Home/Merchant/color",    //颜色提交接口 id 项目id color 颜色以逗号分隔的字符串
        checkDone:"/app.php/Home/Merchant/jiancha_end",    //检查完成数据接口 orderid 订单id
        cleanDone:"/app.php/Home/Merchant/qingxiwancheng",    //清洗完成 id 订单id
        getUserInfo:"/app.php/Offline/Member/get_member",    //线下收衣获取用户信息 number 用户会员卡号或手机号
        getNewUcode:"/app.php/Offline/Merchant/ucode",    //获取最新卡号
        addNewMember:"/app.php/Offline/Member/add_member",    //新增散客 ucode=会员编号 uname=会员姓名 sex=性别 mobile=手机号 birthday=会员生日
        merchantInfo:"/app.php/Offline/Merchant/detail"    //门店信息
    };
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