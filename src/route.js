import Order from './order/order';
import Item from './order/item';
import Craft from './order/craft';
import Check from './order/check';
import Color from './order/color';
import Question from './order/question';
import Take from './offline/take';
import AddMember from './offline/add_member';
import Pay from './offline/pay';
import Info from './manage/info';
import InfoEditor from './manage/info_editor';
import Message from './manage/message';
import ClerkManage from './manage/clerk_manage'
import Finance from './manage/finance';
import Appraise from './manage/appraise';
import Award from './manage/award';
import Goods from './manage/goods';
import GoodsAdd from './manage/goods_add';
import Operate from './manage/operate';
import OrderSearch from './order/order_search';
import OrderDetail from './order/order_detail';
import Teamwork from './manage/teamwork';
import Voucher from './manage/voucher';
import VoucherList from './manage/voucher_list';
import OfflineClean from './offline/offline_clean'
import OfflineDrying from './offline/offline_drying'
import OfflineIroning from './offline/offline_ironing'
import OfflineCheck from './offline/offline_check'
import Registration from './offline/registration';
import InFactory from './offline/infactory';
import OutFactory from './offline/outfactory';
import OfflineTake from './offline/offline_take';
import MemberManage from './member/member_manage';
import MemberDetail from './member/member_detail';
import MemberConsume from './member/member_consume';
import MemberRechargeRecord from './member/member_recharge_record';
import MemberBalance from './member/member_balance';
import OfflineStatistic from './offline/offline_statistic';
import OfflineAddMember from './member/offline_add_member';
import OfflineAddCompany from './member/offline_add_company';
import MemberRecharge from './member/member_recharge';
import MemberUpdateInfo from './member/member_update_info';
import OfflineOrderDetail from './offline/offline_order_detail';
import OfflineCraft from './offline/offline_craft';
import OfflineEditor from './offline/offline_editor';
import After from './order/after';
import OnlineEditor from './order/online_editor';
export default {
    order:Order,    //订单处理
    item:Item,    //添加项目
    craft:Craft,    //工艺加价
    check:Check,    //衣物检查
    color:Color,    //颜色设置
    question:Question,    //问题描述
    take:Take,    //线下收衣
    addMember:AddMember,    //散客信息
    pay:Pay,    //订单支付
    info:Info,    //门店信息
    info_editor:InfoEditor,    //信息编辑
    message:Message,    //消息通知
    clerk_manage:ClerkManage,    //员工管理
    finance:Finance,    //财务对账
    appraise:Appraise,    //用户评价
    award:Award,    //返现记录
    goods:Goods,    //商品管理
    goods_add:GoodsAdd,    //添加商品
    operate:Operate,    //经营分析
    order_search:OrderSearch,    //订单查询
    order_detail:OrderDetail,    //订单详情
    teamwork:Teamwork,    //合作门店
    voucher:Voucher,    //制作代金券
    voucher_list:VoucherList,    //生成代金券
    offline_clean:OfflineClean,    //送洗
    offline_drying:OfflineDrying,    //烘干
    offline_ironing:OfflineIroning,    //熨烫
    offline_check:OfflineCheck,    //质检
    registration:Registration,    //上挂
    infactory:InFactory,    //入厂
    outfactory:OutFactory,    //出厂
    offline_take:OfflineTake,    //取衣
    member_manage:MemberManage,    //会员管理
    member_detail:MemberDetail,    //会员详情
    member_consume:MemberConsume,    //会员消费报表
    member_recharge_record:MemberRechargeRecord,    //会员充值报表
    member_balance:MemberBalance,    //会员余额
    offline_statistic:OfflineStatistic,    //业务统计
    offline_add_member:OfflineAddMember,    //新增个人会员
    offline_add_company:OfflineAddCompany,    //新增企业会员
    member_recharge:MemberRecharge,    //会员充值
    member_update_info:MemberUpdateInfo,    //会员信息变更
    offline_order_detail:OfflineOrderDetail,    //线下订单详情
    offline_craft:OfflineCraft,    //线下工艺加价界面
    offline_editor:OfflineEditor,    //线下工艺加价编辑界面
    after:After,    //洗后预估界面
    online_editor:OnlineEditor,    //线上编辑界面
}