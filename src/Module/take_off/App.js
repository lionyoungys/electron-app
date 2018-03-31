/**
 * 线下取衣组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import Search from '../UI/search/App';
import SelectSearch from '../../Elem/SelectSearch';
import Toast from '../UI/cancel-toast/App';
import './App.css';

export default class extends Component{
    constructor(props) {
        super(props);
        this.state = {data:[],user:{},show:false,toastData:[],oid:null,number:null};
        this.onSearchRequest = this.onSearchRequest.bind(this);
        this.query = this.query.bind(this);
        this.onTakeRequest = this.onTakeRequest.bind(this);
        this.onConfirmRequest = this.onConfirmRequest.bind(this);
        this.onTakePayRequest = this.onTakePayRequest.bind(this);
    }

    onSearchRequest(value, selected) {
        console.log(selected);
        this.query(value);
    }
    query(value) {
        value = tool.isSet(value) ? value : this.state.value;
        axios.post(api.U('take_off'), api.D({token:this.props.token,number:value}))
        .then(response => {
            if (api.V(response.data)) {
                let result = response.data.result;
                console.log(result);
                this.setState({data:result.list,user:result.userinfo,number:value});
            }
        });
    }
    onTakeRequest(e) {
        let id = e.target.dataset.id,
            index = id.inObjectArray(this.state.data, 'id'),
            items = this.state.data[index].items,
            len = items.length;
        if (len < 1) return alert('暂无可取衣物');
        let temp = [];
        for (let i = 0;i < len;++i) {
            if (91 == items[i].status) temp.push({key:items[i].id,value:items[i].item_name});
        }
        if (temp.length < 1) return alert('暂无可取衣物');
        this.setState({show:true,toastData:temp,oid:id});
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

    onConfirmRequest(checked, details) {
        let len = details.length;
        if (len < 1) return;
        let temp = [];
        for (let i = 0;i < len;++i) {
            temp.push(details[i].key);
        }
        axios.post(
            api.U('take_it_off'),
            api.D({
                token:this.props.token,
                moduleid:100,
                type:1,
                itemids:temp.toString(),
                orderid:this.state.oid
            })
        )
        .then(response => {
            if (api.V(response.data)) {
                this.setState({show:false,toastData:[]});
                this.query();
            } else {
                alert(response.data.msg);
            }
        });
    }


    itemsToHtml(items) {
        return items.map((obj, index) => 
            <div key={index} className='m-between-box online'>
                <span>{obj.item_name}</span>
                <span>{tool.itemStatus(obj.status)}</span>
                <span>{obj.put_sn}</span>
            </div>
        );
    }

    render() {
        let props = this.props,
            state = this.state;
        /*let html = this.state.data.map(obj =>
                <tr className='bd-lightgrey' key={obj.id}>
                    <td>{obj.ordersn}</td>
                    <td style={{lineHeight:'24px'}}>
                        姓&emsp;名：{this.state.user.uname}<br/>
                        手机号：{this.state.user.umobile}<br/>
                        件&emsp;数：{obj.count}<br/>
                        状&emsp;态：{1 == obj.pay_state ? '已支付' : '未支付'}<br/>
                        总&emsp;额：<span className='m-red'>{obj.pay_amount}</span>
                    </td>
                    <td>{this.itemsToHtml(obj.items)}</td>
                    <td>{tool.currentDate('datetime', obj.otime)}</td>
                    <td>
                        <button
                            type='button'
                            className='m-btn confirm'
                            data-id={obj.id}
                            onClick={this.onTakeRequest}
                        >单件取衣</button>
                        &emsp;
                        <button
                            type='button'
                            className='m-btn confirm'
                            data-state={obj.pay_state}
                            data-id={obj.id}
                            onClick={this.onTakePayRequest}
                        >{1 == obj.pay_state ? '取衣结单' : '立即付款'}</button>
                    </td>
                </tr> 
            
            );*/
        let html = this.state.data.map(obj => 
            <Order key={obj.id} data={obj} onTakePayRequest={this.onTakePayRequest} onTakeRequest={this.onTakeRequest}/>
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
                    <table className='e-table border'><thead><tr><th>衣物编码</th><th>衣物名称</th><th>颜色</th><th>状态</th><th>衣挂号</th><th>取衣时间</th><th>操作</th></tr></thead></table>
                </div>
                {html}
                <Toast
                    show={this.state.show}
                    data={this.state.toastData}
                    title='单件取衣'
                    btnValue='确认'
                    onCloseRequest={() => this.setState({show:false,toastData:[]})}
                    onConfirmRequest={this.onConfirmRequest}
                />
            </div>
        );
    }
}

class Order extends Component{
    constructor(props) {super(props)}
    render() {
        let data = this.props.data;
        /*let html = this.state.data.map(obj =>
                <tr className='bd-lightgrey' key={obj.id}>
                    <td>{obj.ordersn}</td>
                    <td style={{lineHeight:'24px'}}>
                        姓&emsp;名：{this.state.user.uname}<br/>
                        手机号：{this.state.user.umobile}<br/>
                        件&emsp;数：{obj.count}<br/>
                        状&emsp;态：{1 == obj.pay_state ? '已支付' : '未支付'}<br/>
                        总&emsp;额：<span className='m-red'>{obj.pay_amount}</span>
                    </td>
                    <td>{this.itemsToHtml(obj.items)}</td>
                    <td>{tool.currentDate('datetime', obj.otime)}</td>
                    <td>
                        <button
                            type='button'
                            className='m-btn confirm'
                            data-id={obj.id}
                            onClick={this.onTakeRequest}
                        >单件取衣</button>
                        &emsp;
                        <button
                            type='button'
                            className='m-btn confirm'
                            data-state={obj.pay_state}
                            data-id={obj.id}
                            onClick={this.onTakePayRequest}
                        >{1 == obj.pay_state ? '取衣结单' : '立即付款'}</button>
                    </td>
                </tr> 
            
            );*/
        let html = data.items.map(obj => 
            <tr key={obj.id}>
                <td></td>
                <td>{obj.item_name}</td>
                <td></td>
                <td>{tool.itemStatus(obj.status)}</td>
                <td>{obj.put_sn}</td>
                <td></td>
                <td className={100 == obj.status ? 'e-grey' : 'e-blue e-pointer'}>单件取衣</td>
            </tr>
        );
        return (
            <div className='e-box'>
                <div className='take-off-order'>
                    <span>订单号：{data.ordersn}</span>
                    <span>订单状态：{1 == data.pay_state ? '已支付' : '未支付'}</span>
                    <button
                        type='button'
                        className='e-btn confirm small'
                        data-id={data.id}
                        data-state={data.pay_state}
                        onClick={this.props.onTakePayRequest}
                    >{1 == data.pay_state ? '取衣结单' : '立即付款'}</button>
                </div>
                <table className='e-table border'><tbody>{html}</tbody></table>
            </div>
        );
    }
}