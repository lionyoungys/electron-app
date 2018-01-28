/**
 * 线下取衣组件
 * @author yangyunlong
 */
import React from 'react';
import Crumb from '../UI/crumb/App';
import Search from '../UI/search/App';
import Toast from '../UI/cancel-toast/App';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {data:[],user:{},show:false,toastData:[],oid:null,number:null};
        this.onSearchRequest = this.onSearchRequest.bind(this);
        this.query = this.query.bind(this);
        this.onTakeRequest = this.onTakeRequest.bind(this);
        this.onConfirmRequest = this.onConfirmRequest.bind(this);
        this.onTakePayRequest = this.onTakePayRequest.bind(this);
    }

    onSearchRequest(value) {
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
        let html = this.state.data.map(obj =>
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
            
            );
            
        return (
            <div>
                <Crumb data={[{key:0,value:'取衣'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div className='m-text-r'><Search placeholder='请输入客户手机号' callback={this.onSearchRequest}/></div>
                    <div className='m-box'>
                        <table className='m-table'>
                            <thead><tr className='bd-lightgrey m-bg-white'>
                                <th>订单号</th>
                                <th>信息</th>
                                <th>项目/状态/编码</th>
                                <th>时间</th>
                                <th>操作</th>
                            </tr></thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                </div>
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