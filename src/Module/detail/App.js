/**
 * 订单详情组件
 * @author yangyunlong
 */

import React, {Component} from 'react';
import ImgBox from '../UI/img-box/App';
import './App.css';


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
            console.log(response.data);
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
        
        let html = this.state.items.map(obj =>
                <DataRender key={obj.id} data={obj} isOnline={this.state.isOnline}/>
            );
        const display = {display:(1 == this.state.isOnline ? 'inline' : 'none')};
        return (
            <div>
                <div className='m-container'>
                    <div className='detail-box'>{html}</div>
                    <div className='m-box' style={{lineHeight:'30px'}}>
                        共{this.state.count}件&emsp;&emsp;
                        活动优惠:-&yen;{this.state.reducePrice}&emsp;&emsp;
                        <span style={display}>
                            上门服务费:&yen;{this.state.freightPrice}&emsp;&emsp;
                        </span>
                        总价:&yen;{this.state.totalAmount}&emsp;&emsp;
                        {
                            1 == this.state.payState
                            ? 
                            (<span className='m-red'>实付:{this.state.payAmount}</span>)
                            :
                            (<span className='m-red'>(未付款)</span>)}
                    </div>
                    <div className='detail-row'>
                        {1 == this.state.isCompany ? (<span>企业名称:</span>) : <span>姓名:</span>}{this.state.uname}
                    </div>
                    <div className='detail-row' style={display}><span>预约时间:</span>{this.state.time}</div>
                    <div className='detail-row'><span>手机号:</span>{this.state.umobile}</div>
                    <div className='detail-row'><span>订单号:</span>{this.state.ordersn}</div>
                    <div className='detail-row'><span>下单时间:</span>{this.state.otime}</div>
                    <div className='detail-row'><span>订单地址:</span>{this.state.uaddress}</div>
                    <div className='detail-row' style={display}><span>备注:</span>{this.state.remark}</div>
                </div>
            </div>
        );
    }
}

class DataRender extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let data = this.props.data;
        return (
            <div className='detail-item'>
                <div>
                    <img src={data.image}/>
                    <div>
                        <div>{data.item_name}</div>
                        <div>价格：&yen;{data.item_real_price}</div>
                    </div>
                </div>
                <div className='row'><span>衣物编码：</span>{data.clean_sn}</div>
                <div className='row' style={{display:(0 == this.props.isOnline ? 'block':'none')}}><span>取衣时间：</span>{data.take_time}</div>
                <div className='row'><span>保值金额：</span>{(data.keep_price * 200).toFixed(2)}</div>
                <div className='row'><span>保值清洗费：</span>{data.keep_price}</div>
                <div className='row'><span>工艺加价：</span>{data.craft_price}</div>
                <div className='row'><span>备注：</span>{data.craft_des}</div>
                <div className='row'><span>颜色：</span>{data.color}</div>
                <div className='row'><span>问题：</span>{data.problem}</div>
                <div className='row'><span>洗后预估：</span>{data.forecast}</div>
                <div>
                    <ImgBox images={data.item_images}/>
                </div>
            </div>
            // <section className='ui-detail'>
            //     <div className='ui-detail-logo'><img src={api.host + obj.url}/></div>
            //     <div className='ui-detail-item'>
            //         <div>{obj.g_name}</div>
            //         <div>价格：{obj.price}</div>
            //         <div>数量：{obj.number}</div>
            //     </div>
            //     <div className='ui-detail-item2'>
            //         <div>特殊工艺加价：{obj.special}</div>
            //         <div>保值清洗费：{obj.hedging}</div>
            //         <div>保值金额：{obj.hedging * 200}</div>
            //     </div>
            //     <div className='ui-detail-images'>{images}</div>
            // </section>
        );
    }
}