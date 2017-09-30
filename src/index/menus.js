/**
 * 菜单导航栏配置
 * @author yangyunlong
 */
class Menus {
    constructor () {
        return [
            {
                id:1,
                selection:{
                    id:'order',
                    text:'线上订单'
                },
                options:[
                    {id:11, text:'订单查询'},
                    {id:12, text:'订单处理'}
                ]
            },
            {
                id:2,
                selection:{
                    id:'finance',
                    text:'线下收银'
                },
                options:[
                    {id:21, text:'收衣'},
                    {id:22, text:'送洗'},
                    {id:23, text:'上挂'},
                    {id:24, text:'取衣'},
                    {id:25, text:'会员管理'},
                    {id:26, text:'业务统计'}
                ]
            },
            {
                id:3,
                selection:{
                    id:'manage',
                    text:'商家管理'
                },
                options:[
                    {id:31, text:'商品管理'},
                    {id:32, text:'财务对账'},
                    {id:33, text:'经营分析'},
                    {id:34, text:'员工管理'},
                    {id:35, text:'返现记录'},
                    {id:36, text:'消息通知'},
                    {id:37, text:'用户评价'},
                    {id:38, text:'门店信息'}
                ]
            }
        ];
    }
}

export default new Menus();