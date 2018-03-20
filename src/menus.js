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
            {text:'收件',key:'take',auth:1},
            //{text:'入厂',key:'in_factory',auth:8},    //infactory
            {text:'清洗',key:'clean',auth:2},    //offline_clean
            {text:'烘干',key:'dry',auth:50},    //offline_clean
            {text:'熨烫',key:'ironing',auth:51},    //offline_ironing
            {text:'质检',key:'check',auth:52},    //offline_check
            {text:'上挂',key:'put_on',auth:3},    //registration
            //{text:'出厂',key:'out_of_factory',auth:9},    //outfactory
            {text:'取衣',key:'take_off',auth:4},    //offline_take
            {text:'返流审核',key:'go_back_check',auth:7},    //offline_take2
            {text:'会员管理',key:'member',auth:6},
            {text:'业务统计',key:'statistics',auth:5}
        ]
    },
    {
        id:'manage',
        text:'商家管理',
        options:[
            {text:'商品管理',key:'goods'},
            {text:'财务对账',key:'balance'},
            {text:'经营分析',key:'chart'},
            {text:'订单查询',key:'order_search'},
            {text:'员工管理',key:'employee'},
            {text:'返现记录',key:'award'},
            // {text:'用户评价',key:'comment'},
            {text:'业绩统计',key:'performance'},
            {text:'连锁门店',key:'link'},
            {text:'门店信息',key:'info'},
            {text:'合作门店',key:'teamwork'},
            {text:'卡券中心',key:'coupon'}
        ]
    }
];
