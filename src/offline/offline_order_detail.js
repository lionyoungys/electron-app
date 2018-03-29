/**
 * 线下业务统计组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import {LightboxImage,BoxOfImages} from '../static/UI';
const {ipcRenderer} = window.require('electron');

export default class OfflineOrderDetail extends Component{
    constructor(props) {
        super(props);
        this.params = this.props.param;
        this.state = {
            count:'0',freight:'0',total:'0',payAmount:'0',
            ordersn:'',createTime:'',address:'',comment:'',
            name:'',mobile:'',
            items:[]
        };
        this.printOrder = this.printOrder.bind(this);
        console.log(this.params);
    }

    componentDidMount() {
        axios.post(api.U('offlineOrderDetail'),api.D({token:this.props.token,order_id:this.params.id}))
        .then(response => {
            let result = response.data.data;
            this.setState({
                count:result.items_count,
                freight:result.freight,
                total:result.amount,
                payAmount:result.pay_amount,
                ordersn:result.ordersn,
                createTime:result.create_time,
                address:result.address,
                name:result.username,
                mobile:result.mobile,
                items:result.items
            });
            console.log(result);
        });
    }

    printOrder() {
        let printView = 'public/prints/index.html';
        if ('invoice' == this.props.branch) {
            printView = 'public/prints/invoice.html';
        }
        ipcRenderer.send(
            'print-silent',
            printView,
            {uid:this.props.uid,order_id:this.params.id,token:this.props.token}
        );
    }

    render() {
        let props = this.props,
            state = this.state,
            html = state.items.map((obj, index) =>
                <Item key={index} obj={obj}/>
            );
        const style = {width:'170px',color:'grey',display:'inline-block'};
        return (
            <div>
                <section className='ui-container'>
                    {html}
                    <div className='ui-content'>
                        共{state.count}件&emsp;&emsp;&emsp;
                        上门服务费：&yen;{state.freight}&emsp;&emsp;&emsp;
                        总计：&yen;{state.total}&emsp;&emsp;&emsp;
                        <span className='ui-red'>实付：&yen;{func.isSet(state.payAmount) ? state.payAmount : 0}</span>
                    </div>
                    <div style={{paddingTop:'60px'}}>
                        <span style={style}>姓名：</span>{state.name}
                    </div>
                    <div style={{paddingTop:'18px'}}>
                        <span style={style}>手机号：</span>{state.mobile}
                    </div>
                    <div style={{paddingTop:'18px'}}>
                        <span style={style}>订单号：</span>{state.ordersn}
                    </div>
                    <div style={{paddingTop:'18px'}}>
                        <span style={style}>下单时间：</span>{state.createTime}
                    </div>
                    <div style={{paddingTop:'18px'}}>
                        <span style={style}>订单地址：</span>{state.address}
                    </div>
                    <div style={{paddingTop:'20px'}}>
                        <input 
                            type='button' 
                            value='打印订单' 
                            className='ui-btn ui-btn-confirm ui-btn-large'
                            onClick={this.printOrder}
                        />
                    </div>
                </section>
            </div>
        );
    }
}

class Item extends Component {
    constructor(props) {super(props);}

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
                    <div>备注：{func.isSet(obj.special_comment) ? obj.special_comment : '暂无备注'}</div>
                </div>
                <div className='ui-detail-item2'>
                    <div>特殊工艺加价：{obj.special}</div>
                    <div>保值清洗费：{obj.hedging}</div>
                    <div>保值金额：{obj.hedging * 200}</div>
                    <div>取衣时间：</div>
                </div>
                <BoxOfImages>{images}</BoxOfImages>
            </section>
        );
    }
}