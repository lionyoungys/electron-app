/**
 * 订单详情组件
 * @author yangyunlong
 */

import React, {Component} from 'react';
import Crumb from '../UI/crumb/App';
import {LightboxImage} from '../../static/UI';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersn:'',
            isOnline:1,
            amount:'',
            payAmount:'',
            totalAmount:'',
            freightPrice:'',
            keepPrice:'',
            craftPrice:'',
            reducePrice:'',
            payState:0,
            otime:'',
            ostatus:0,
            count:0,
            uname:'',
            umobile:'',
            uaddress:'',
            remark:'',
            time:'',
            isCompany:0,
            items:[],       
        };
    }

    componentDidMount() {
        axios.post(api.U('order_detail'), api.D({token:this.props.token,oid:this.props.param.id}))
        .then((response) => {
            if (!api.V(response.data)) return;
            let result = response.data.result;
            this.setState({
                ordersn:result.ordersn,
                isOnline:result.is_online,
                amount:result.amount,
                payAmount:result.pay_amount,
                totalAmount:result.total_amount,
                freightPrice:result.freight_price,
                keepPrice:result.keep_price,
                craftPrice:result.craft_price,
                reducePrice:result.reduce_price,
                payState:result.pay_state,
                otime:result.otime,
                ostatus:result.ostatus,
                count:result.item_count,
                uname:result.uname,
                umobile:result.umobile,
                uaddress:response.uaddress,
                remark:result.uremark,
                time:result.time,
                isCompany:result.is_company,
                items:result.items
            });
        });
    }

    render () {
        let props = this.props,
            state = this.state,
            html = state.items.map(obj =>
                <DataRender key={obj.id} obj={obj}/>
            );
        const style = {width:'170px',color:'grey',display:'inline-block'};
        return (
            <div>
                <Crumb 
                    data={[{key:0,value:this.props.param.value,view:this.props.param.view},{key:1,value:'订单详情'}]} 
                    callback={this.props.changeView}
                />
                <div className='m-container'>
                    
                </div>
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

class DataRender extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let obj = this.props.obj,
            images = obj.img.map((obj2,index) =>
                <LightboxImage src={api.host + obj2.img} key={index}/>
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