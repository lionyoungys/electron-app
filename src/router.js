import Index from './Module/index/App';
import Passwd from './Module/passwd/App';
import Feedback from './Module/feedback/App';
import Take from './Module/take/App';
import Register from './Module/register/App';
import Online from './Module/online/App';
import OnlineAddItem from './Module/online_add_item/App';
import Upload from './Module/upload/App';
import Coupon from './Module/coupon/App';
import CouponDetail from './Module/coupon_detail/App';
import Goods from './Module/goods/App';
import GoodsAdd from './Module/goods_add/App';
import Info from './Module/info/App';
import OrderSearch from './Module/order_search/App';
import Balance from './Module/balance/App';
import Member from './Module/member/App';
import MemberSpend from './Module/member_spend/App';
import MemberRecharge from './Module/member_recharge/App';
import MemberBalance from './Module/member_balance/App';
import Statistics from './Module/statistics/App';
import Employee from './Module/employee/App';
import MemberUpdate from './Module/member_update/App';
import MemberAddUser from './Module/member_add_user/App';
import MemberAddCompany from './Module/member_add_company/App';
import Recharge from './Module/recharge/App';
import OfflineAddItem from './Module/offline_add_item/App';
import OrderPay from './Module/order_pay/App';
import InFactory from './Module/in_factory/App';
import Clean from './Module/clean/App';
import Dry from './Module/dry/App';
import Ironing from './Module/ironing/App';
import Check from './Module/check/App';
import GoBack from './Module/go_back/App';
import PutOn from './Module/put_on/App';
import OutOfFactory from './Module/out_of_factory/App';
import TakeOff from './Module/take_off/App';
import GoBackCheck from './Module/go_back_check/App';
import Teamwork from './Module/teamwork/App';
import Link from './Module/link/App';
import Chart from './Module/chart/App';
import Detail from './Module/detail/App';
import Performance from './Module/performance/App';
import Update from './Module/update/App';
import MsgPlatgorm from './Module/msg_platform/App';
import MsgDetail from './Module/msg_detail/App';
import MemberDetail from './Module/member_detail/App';
import Done from './Module/done/App';
import ChangeCard from './Module/change_card/App';
import ChangeCardConfirm from './Module/change_card_confirm/App';


import InfoEditor from './manage/info_editor';
import Message from './manage/message';
import Finance from './manage/finance';
import Comment from './manage/comment';
import Award from './manage/award';
import OrderDetail from './order/order_detail';
import Registration from './offline/registration';
import OutFactory from './offline/outfactory';
import OfflineTake from './offline/offline_take';
import MemberRechargeRecord from './member/member_recharge_record';
import OfflineStatistic from './offline/offline_statistic';
import OfflineAddMember from './member/offline_add_member';
import OfflineAddCompany from './member/offline_add_company';
import OfflineOrderDetail from './offline/offline_order_detail';
import OfflineEditor from './offline/offline_editor';

export const menu = {    //菜单列表
    online:'线上订单',
    offline:'线下收银',
    manage:'商家管理',
    message:'消息预警',
    help:'帮助'
};

export const router = {    //菜单路由选项
    online:[{value:'订单处理',key:'online'}],
    offline:[
        {value:'收件',key:'take',auth:1},
        {value:'入厂',key:'in_factory',auth:8},    //infactory
        {value:'清洗',key:'clean',auth:2},    //offline_clean
        {value:'烘干',key:'dry',auth:50},    //offline_clean
        {value:'熨烫',key:'ironing',auth:51},    //offline_ironing
        {value:'质检',key:'check',auth:52},    //offline_check
        {value:'上挂',key:'put_on',auth:3},    //registration
        {value:'出厂',key:'out_of_factory',auth:9},    //outfactory
        {value:'取衣',key:'take_off',auth:4},    //offline_take
        {value:'返流审核',key:'go_back_check',auth:7},    //offline_take2
        {value:'会员管理',key:'member',auth:6},
        {value:'业务统计',key:'statistics',auth:5}
    ],
    manage:[
        {value:'商品管理',key:'goods'},
        {value:'财务对账',key:'balance'},
        {value:'经营分析',key:'chart'},
        {value:'订单查询',key:'order_search'},
        {value:'员工管理',key:'employee'},
        {value:'返现记录',key:'award'},
        // {value:'用户评价',key:'comment'},
        {value:'员工业绩',key:'performance'},
        {value:'连锁门店',key:'link'},
        {value:'门店信息',key:'info'},
        {value:'合作门店',key:'teamwork'},
        {value:'卡券中心',key:'coupon'}
    ],
    message:[
        {value:'平台消息',key:'msg_platform'},
        {value:'交期预警',key:'msg_platform__2'},
        {value:'到期未取',key:'msg_platform__3'}
    ],
    help:[
        {value:'检查更新',key:'update'},
        {value:'意见反馈',key:'feedback'},
        {value:'密码修改',key:'passwd'}
    ]
}

export const view = {
    index:Index,    //首页
    passwd:Passwd,    //修改密码
    feedback:Feedback,    //反馈
    take:Take,    //线下收衣
    register:Register,    //新增散客添加信息
    online:Online,    //线上订单订单处理
    online_add_item:OnlineAddItem,    //线上订单添加项目
    upload:Upload,    //添加图片
    coupon:Coupon,    //卡券中心
    coupon_detail:CouponDetail,    //卡券详情
    goods:Goods,    //商品管理
    goods_add:GoodsAdd,    //添加商品
    info:Info,    //门店信息
    order_search:OrderSearch,    //订单查询
    balance:Balance,    //财务对账
    member:Member,    //会员管理
    member_spend:MemberSpend,    //用户消费
    member_recharge:MemberRecharge,    //会员充值
    member_balance:MemberBalance,    //会员余额
    statistics:Statistics,        //业务统计
    employee:Employee,       //员工管理
    member_update:MemberUpdate,    //会员信息变更
    member_add_user:MemberAddUser,    //新增个人会员
    member_add_company:MemberAddCompany,    //新增企业会员
    recharge:Recharge,                  //会员充值
    offline_add_item:OfflineAddItem,    //线下添加项目
    order_pay:OrderPay,                            //订单支付
    in_factory:InFactory,                  //入厂
    clean:Clean,               //清洗
    dry:Dry,               //烘干
    ironing:Ironing,    //熨烫
    check:Check,         //质检
    go_back:GoBack,    //返流
    put_on:PutOn,    //上挂
    out_of_factory:OutOfFactory,    //出厂
    take_off:TakeOff,       //取衣
    go_back_check:GoBackCheck,    //返流审核
    teamwork:Teamwork,    //合作门店
    link:Link,         //连锁门店
    chart:Chart,    //经营分析
    detail:Detail,    //订单详情
    performance:Performance,    //业绩统计
    update:Update,        //软件更新
    msg_platform:MsgPlatgorm,    //平台消息
    ['msg_platform__2']:MsgPlatgorm,    //交期预警
    ['msg_platform__3']:MsgPlatgorm,    //到期未取
    msg_detail:MsgDetail,             //平台消息详情
    member_detail:MemberDetail,    //会员详情
    done:Done,
    change_card:ChangeCard,    //换卡界面
    change_card_confirm:ChangeCardConfirm,    //换卡二次确认界面
    

    info_editor:InfoEditor,    //信息编辑
    message:Message,    //消息通知
    comment:Comment,    //用户评价
    award:Award,    //返现记录
    order_detail:OrderDetail,    //订单详情
    registration:Registration,    //上挂
    outfactory:OutFactory,    //出厂
    offline_take:OfflineTake,    //取衣
    member_recharge_record:MemberRechargeRecord,    //会员充值报表
    offline_statistic:OfflineStatistic,    //业务统计
    offline_add_member:OfflineAddMember,    //新增个人会员
    offline_add_company:OfflineAddCompany,    //新增企业会员
    offline_order_detail:OfflineOrderDetail,    //线下订单详情
    offline_editor:OfflineEditor,    //线下工艺加价编辑界面
    
};