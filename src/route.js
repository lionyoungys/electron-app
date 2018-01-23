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


import Item from './order/item';
import Craft from './order/craft';
import Check from './order/check';
import Color from './order/color';
import Question from './order/question';
import Pay from './offline/pay';
import InfoEditor from './manage/info_editor';
import Message from './manage/message';
import Finance from './manage/finance';
import Comment from './manage/comment';
import Award from './manage/award';
import Operate from './manage/operate';
import OrderDetail from './order/order_detail';
import Teamwork from './manage/teamwork';
import OfflineClean from './offline/offline_clean'
import OfflineDrying from './offline/offline_drying'
import OfflineIroning from './offline/offline_ironing'
import OfflineCheck from './offline/offline_check'
import Registration from './offline/registration';
import InFactory from './offline/infactory';
import OutFactory from './offline/outfactory';
import OfflineTake from './offline/offline_take';
import MemberDetail from './member/member_detail';
import MemberRechargeRecord from './member/member_recharge_record';
import OfflineStatistic from './offline/offline_statistic';
import OfflineAddMember from './member/offline_add_member';
import OfflineAddCompany from './member/offline_add_company';
//import MemberRecharge from './member/member_recharge';
import OfflineOrderDetail from './offline/offline_order_detail';
import OfflineCraft from './offline/offline_craft';
import OfflineEditor from './offline/offline_editor';
import After from './order/after';
import OnlineEditor from './order/online_editor';
export default {
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
    
    
    item:Item,    //添加项目
    craft:Craft,    //工艺加价
    check:Check,    //衣物检查
    color:Color,    //颜色设置
    question:Question,    //问题描述
    pay:Pay,    //订单支付
    info_editor:InfoEditor,    //信息编辑
    message:Message,    //消息通知
    comment:Comment,    //用户评价
    award:Award,    //返现记录
    operate:Operate,    //经营分析
    order_detail:OrderDetail,    //订单详情
    teamwork:Teamwork,    //合作门店
    offline_clean:OfflineClean,    //送洗
    offline_drying:OfflineDrying,    //烘干
    offline_ironing:OfflineIroning,    //熨烫
    offline_check:OfflineCheck,    //质检
    registration:Registration,    //上挂
    infactory:InFactory,    //入厂
    outfactory:OutFactory,    //出厂
    offline_take:OfflineTake,    //取衣
    member_detail:MemberDetail,    //会员详情
    member_recharge_record:MemberRechargeRecord,    //会员充值报表
    offline_statistic:OfflineStatistic,    //业务统计
    offline_add_member:OfflineAddMember,    //新增个人会员
    offline_add_company:OfflineAddCompany,    //新增企业会员
    offline_order_detail:OfflineOrderDetail,    //线下订单详情
    offline_craft:OfflineCraft,    //线下工艺加价界面
    offline_editor:OfflineEditor,    //线下工艺加价编辑界面
    after:After,    //洗后预估界面
    online_editor:OnlineEditor,    //线上编辑界面
    
}