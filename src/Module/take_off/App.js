/**
 * 线下取衣组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import Search from '../UI/search/App';
import SelectSearch from '../../Elem/SelectSearch';
import './App.css';

export default class extends Component{
    constructor(props) {
        super(props);
        this.state = {data:[],user:{},number:null};
        this.onSearchRequest = this.onSearchRequest.bind(this);
        this.query = this.query.bind(this);
        this.onTakePayRequest = this.onTakePayRequest.bind(this);
        this.takeOne = this.takeOne.bind(this);
    }

    onSearchRequest(value, selected) {
        console.log(selected);
        this.query(value);
    }
    query(value) {
        value = tool.isSet(value) ? value : this.state.number;
        api.post('take_off', {token:this.props.token,number:value}, (response, verify) => {
            if (verify) {
                let result = response.data.result;
                this.setState({data:result.list,user:result.userinfo,number:value});
            }
        })
    }

    onTakePayRequest(e) {
        let id = e.target.dataset.id,
            payState = e.target.dataset.state;
        if (1 != payState) {
            this.props.changeView({view:'order_pay',param:{oid:id,value:'取衣',view:'take_off'}});
        } else {
            axios.post(api.U('take_it_off'),api.D({token:this.props.token,orderid:id,moduleid:100,type:2}))
            .then(response => {
                if (api.V(response.data)) {
                    alert('操作成功');
                    this.query();
                } else {
                    alert(response.data.msg);
                }
            });
        }
    }

    takeOne(e) {
        let data = e.target.dataset;
        api.post(
            'take_it_off', 
            {
                token:this.props.token,
                moduleid:100,
                type:1,
                itemids:data.id,
                orderid:data.oid
            },
            (response, verify) => {
                if (verify) {
                    this.query();
                } else {
                    alert(response.data.msg);
                }
            }
        )
    }

    render() {
        let html = this.state.data.map(obj => 
            <Order key={obj.id} data={obj} onTakePayRequest={this.onTakePayRequest} takeOne={this.takeOne}/>
        )
        return (
            <div className='take-off'>
                <div className='take-off-top'>
                    <div className='left'>
                        <span>姓名：{this.state.user.uname}</span>
                        <span>手机号：{this.state.user.umobile}</span>
                        <span>卡号：</span>
                    </div>
                    <div className='right'>
                        <SelectSearch option={['手机号','订单号','衣物编码','会员卡号']} callback={this.onSearchRequest}/>
                    </div>
                </div>
                <div className='e-box'>
                    <table className='e-table border'>
                        <thead><tr><th>衣物编码</th><th>衣物名称</th><th>颜色</th><th>状态</th><th>衣挂号</th><th>取衣时间</th><th>操作</th></tr></thead>
                        {html}
                    </table>
                </div>
            </div>
        );
    }
}

class Order extends Component{
    constructor(props) {super(props)}

    render() {
        let data = this.props.data;
        let html = data.items.map(obj => 
            <tr key={obj.id}>
                <td>{obj.clean_sn}</td>
                <td>{obj.item_name}</td>
                <td>{obj.color}</td>
                <td>{tool.itemStatus(obj.status)}</td>
                <td>{obj.put_sn}</td>
                <td>{obj.take_time}</td>
                <td
                    data-oid={data.id}
                    data-id={obj.id}
                    className={100 == obj.status ? 'e-grey' : 'e-blue e-pointer'}
                    onClick={100 == obj.status ? null : this.props.takeOne}
                >单件取衣</td>
            </tr>
        );
        return (
            <tbody>
                <tr><td colSpan='7' className='take-off-order'>
                    <span>订单号：{data.ordersn}</span>
                    <span>订单状态：{1 == data.pay_state ? '已支付' : '未支付'}</span>
                    <button
                        type='button'
                        className='e-btn confirm small'
                        data-id={data.id}
                        data-state={data.pay_state}
                        onClick={this.props.onTakePayRequest}
                    >{1 == data.pay_state ? '取衣结单' : '立即付款'}</button>
                </td></tr>
                {html}
            </tbody>
        );
    }
}