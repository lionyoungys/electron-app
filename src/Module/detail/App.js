/**
 * 订单详情组件
 * @author yangyunlong
 */

import React, {Component} from 'react';
import ImageLightbox from '../../Elem/ImageLightbox';
import './App.css';


export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show:false,
            index:0,
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
        api.post(
            'order_detail',
            {token:this.props.token,oid:this.props.param.id},
            (response, verify) => {
                if (!verify) return;
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
                    uname:result.uname,
                    umobile:result.umobile,
                    uaddress:response.uaddress,
                    remark:result.uremark,
                    time:result.time,
                    isCompany:result.is_company,
                    items:result.items
                });
            }            
        );
    }

    render () {
        let html = this.state.items.map( (obj, index) =>
            <DataRender
                key={obj.id}
                data={obj}
                isOnline={this.state.isOnline}
                index={index}
                onClick={e => this.setState({show:true,index:e.target.dataset.index})}
            />
        );
        const display = 1 == this.state.isOnline ? null : {display:'none'};
        return (
            <div className='e-box' style={{marginTop:'13px'}}>
                <div>
                    <div className='detail-order'>
                        <div>订&nbsp;单&nbsp;&nbsp;号：{this.state.ordersn}</div>
                        <div>下单时间：{this.state.otime}</div>
                        <div style={display}>预约时间：{this.state.time}</div>
                    </div>
                    <div className='detail-user'>
                        <div>
                            姓&emsp;&emsp;名：{this.state.uname}
                            &emsp;&emsp;&emsp;
                            手&nbsp;&nbsp;机&nbsp;&nbsp;号：{this.state.umobile}
                        </div>
                        <div>订单地址：{this.state.uaddress}</div>
                        <div style={display}>备&emsp;&emsp;注：{this.state.remark}</div>
                    </div>
                </div>
                <div className='detail-amount'>
                    <span>共{this.state.items.length}件</span>
                    <span>活动优惠：-&yen;{this.state.reducePrice}</span>
                    <span style={display}>上门服务费：&yen;{this.state.freightPrice}</span>
                    <span>总价：<span className='e-red'>&yen;{this.state.totalAmount}</span></span>
                    {1 == this.state.payState ? <span className='e-grey'>（已付款）</span> : <span className='e-red'>（未付款）</span>}
                </div>
                <table className='detail-items-table'>
                    {html}
                </table>
                <ImageLightbox 
                    show={this.state.show}
                    images={this.state.items.length > 0 ? this.state.items[this.state.index].item_images : []}
                    onClose={() => this.setState({show:false})}
                />
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
            <tbody>
                <tr className='detail-item-first'>
                    <td>衣物编码：{data.clean_sn}</td>
                    <td>加价</td>
                    <td>描述</td>
                    <td>照片</td>
                </tr>
                <tr className='detail-item-second'>
                    <td>
                        <div>
                            <img src={data.image} className='left'/>
                            <div className='left'>
                                <div>{data.item_name}</div>
                                <div className='e-red'>&yen;{data.item_price}</div>
                            </div>
                        </div>
                        <div>取衣时间：{data.take_time}</div>
                        <div>备注：{data.craft_des}</div>
                    </td>
                    <td>
                        <div>保值金额：&yen;{Math.floor(data.keep_price * 100) * 200 / 100}</div>
                        <div>保值清洗费：&yen;{data.keep_price}</div>
                        <div>工艺加价：&yen;{data.craft_price}</div>
                    </td>
                    <td>
                        <div>颜色：{data.color}</div>
                        <div>瑕疵：{data.problem}</div>
                        <div>洗后预估：{data.forecast}</div>
                    </td>
                    <td className='e-red e-pointer' data-index={this.props.index} onClick={this.props.onClick}>{data.item_images.length}张</td>
                </tr>
                <tr className='detail-item-third'><td colSpan='4'></td></tr>
            </tbody>
        );
    }
}