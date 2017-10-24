/**
 * 订单详情组件
 * @author yangyunlong
 */

import React, {Component} from 'react';
import '../static/api';
import Crumbs,{LightImage} from '../static/UI';

export default class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.param.paramToObject();
        this.state = {
            count:'0',freight:'0',total:'0',payAmount:'0',
            ordersn:'',createTime:'',orderTime:'',address:'',comment:'',
            items:[]
        };
    }

    componentDidMount() {
        axios.post(
            api.U('orderDetail'), 
            api.data({token:this.props.token,id:this.params.id})
        )
        .then((response) => {
            let result = response.data.data;
            this.setState({
                count:result.item_sum,
                freight:result.freight,
                total:result.amount,
                payAmount:result.pay_amount,
                ordersn:result.ordersn,
                createTime:result.create_time,
                orderTime:result.time,
                address:result.adr,
                comment:result.content,
                items:result.item
            });
            console.log(result);
        });
    }

    render () {
        let props = this.props,
            state = this.state,
            html = state.items.map(obj =>
                <Item key={obj.id} obj={obj}/>
            );
        const style = {width:'170px',color:'grey',display:'inline-block'};
        return (
            <div>
                <Crumbs 
                    crumbs={[{key:0,text:'订单查询',e:'order_search'},{key:1,text:'订单详情'}]} 
                    callback={props.changeView}
                />
                <section className='ui-container'>
                    {html}
                    <div className='ui-content'>
                        共{state.count}件&emsp;&emsp;&emsp;
                        上门服务费：&yen;{state.freight}&emsp;&emsp;&emsp;
                        总计：&yen;{state.total}&emsp;&emsp;&emsp;
                        <span className='ui-red'>实付：&yen;{state.payAmount}</span>
                    </div>
                    <div style={{paddingTop:'60px'}}>
                        <span style={style}>订单号：</span>{state.ordersn}
                    </div>
                    <div style={{paddingTop:'18px'}}>
                        <span style={style}>下单时间：</span>{state.createTime}
                    </div>
                    <div style={{paddingTop:'18px'}}>
                        <span style={style}>预约上门时间：</span>{state.orderTime}
                    </div>
                    <div style={{paddingTop:'18px'}}>
                        <span style={style}>订单地址：</span>{state.address}
                    </div>
                    <div style={{paddingTop:'18px'}}>
                        <span style={style}>备注：</span>{state.comment}
                    </div>
                </section>
            </div>
        );
    }
}

class Item extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let obj = this.props.obj,
            images = obj.img.map((obj2,index) =>
                <LightImage src={api.host + obj2.img} key={index}/>
            );
        console.log(obj);
        return (
            <section className='ui-detail'>
                <div className='ui-detail-logo'><img src={api.host + obj.url}/></div>
                <div className='ui-detail-item'>
                    <div>{obj.g_name}</div>
                    <div>价格：{obj.price}</div>
                    <div>数量：{obj.number}</div>
                </div>
                <div className='ui-detail-item2'>
                    <div>特殊工艺加价：{obj.special}</div>
                    <div>保值清洗费：{obj.hedging}</div>
                    <div>保值金额：{obj.hedging * 200}</div>
                </div>
                <div className='ui-detail-images'>{images}</div>
            </section>
        );
    }
}