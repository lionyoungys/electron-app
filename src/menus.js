/**
 * 菜单导航栏配置
 * @author yangyunlong
 */
const Menus = [
    {
        id:1,
        selection:{
            id:'order',
            text:'线上订单'
        },
        options:[
            {id:101, text:'订单查询',e:'order_search'},
            {id:102, text:'订单处理',e:'order'}
        ]
    },
    {
        id:2,
        selection:{
            id:'finance',
            text:'线下收银'
        },
        options:[
            {id:201, text:'收衣',e:'take'},
            {id:202, text:'入厂'},
            {id:203, text:'送洗'},
            {id:204, text:'熨烫'},
            {id:205, text:'上挂'},
            {id:206, text:'出厂'},
            {id:207, text:'取衣'},
            {id:208, text:'会员管理'},
            {id:209, text:'业务统计'}
        ]
    },
    {
        id:3,
        selection:{
            id:'manage',
            text:'商家管理'
        },
        options:[
            {id:301, text:'商品管理',e:'goods'},
            {id:302, text:'财务对账',e:'finance'},
            {id:303, text:'经营分析',e:'operate'},
            {id:304, text:'员工管理',e:'clerk_manage'},
            {id:305, text:'返现记录',e:'award'},
            {id:306, text:'消息通知',e:'message'},
            {id:307, text:'用户评价',e:'appraise'},
            {id:308, text:'门店信息',e:'info'},
            {id:309, text:'合作门店'},
            {id:310, text:'制作代金券'}
        ]
    }
];

export default Menus;