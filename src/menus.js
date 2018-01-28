/**
 * 菜单导航栏配置
 * @author yangyunlong
 */
export default [
    {
        id:'order',
        text:'线上订单',
        options:[
            {text:'订单处理',key:'online'}
        ]
    },
    {
        id:'finance',
        text:'线下收银',
        options:[
            {text:'收件',key:'take'},
            {text:'入厂',key:'in_factory'},    //infactory
            {text:'清洗',key:'clean'},    //offline_clean
            {text:'烘干',key:'dry'},    //offline_clean
            {text:'熨烫',key:'ironing'},    //offline_ironing
            {text:'质检',key:'check'},    //offline_check
            {text:'上挂',key:'put_on'},    //registration
            {text:'出厂',key:'out_of_factory'},    //outfactory
            {text:'取衣',key:'take_off'},    //offline_take
            {text:'返流审核',key:null},    //offline_take2
            {text:'会员管理',key:'member'},
            {text:'业务统计',key:'statistics'}
        ]
    },
    {
        id:'manage',
        text:'商家管理',
        options:[
            {text:'商品管理',key:'goods'},
            {text:'财务对账',key:'balance'},
            {text:'经营分析',key:null},    //operate
            {text:'订单查询',key:'order_search'},
            {text:'员工管理',key:'employee'},
            {text:'返现记录',key:'award'},
            {text:'用户评价',key:'comment'},
            {text:'连锁门店',key:null},    //info2
            {text:'门店信息',key:'info'},
            {text:'合作门店',key:null},    //teamwork
            {text:'卡券中心',key:'coupon'}
        ]
    }
];
