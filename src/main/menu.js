'use strict';
class MenuConfig {
    constructor () {
        return [
            {
                id:1,
                selection:{
                    id:'order',
                    text:'线上订单',
                    status:true
                },
                option:{
                    id:12,
                    items:[
                        {id:121, text:'订单查询'},
                        {id:122, text:'订单处理'}
                    ]
                }
            },
            {
                id:2,
                selection:{
                    id:'finance',
                    text:'线下收银',
                    status:false
                },
                option:{
                    id:22,
                    items:[
                        {id:221, text:'收衣'},
                        {id:222, text:'送洗'},
                        {id:223, text:'上挂'},
                        {id:224, text:'取衣'},
                        {id:225, text:'会员管理'},
                        {id:226, text:'业务统计'}
                    ]
                }
            },
            {
                id:3,
                selection:{
                    id:'manage',
                    text:'商家管理',
                    status:false
                },
                option:{
                    id:32,
                    items:[
                        {id:321, text:'商品管理'},
                        {id:322, text:'财务对账'},
                        {id:323, text:'经营分析'},
                        {id:324, text:'员工管理'},
                        {id:325, text:'返现记录'},
                        {id:326, text:'消息通知'},
                        {id:327, text:'用户评价'},
                        {id:328, text:'门店信息'}
                    ]
                }
            }
        ];
    }
}

export default new MenuConfig();