/**
 * 收件组件
 * @author yangyunlong
 */

import React from 'react';
import Search from '../UI/search/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {id:'',name:'',mobile:'',time:'',order:0,balance:0,cname:''};
        this.search = this.search.bind(this);
        this.nextStep = this.nextStep.bind(this);
    }
    search(value) {
        if (value.match(/^1\d{10}$/) !== null) {
            axios.post(api.U('member'), api.D({token:this.props.token,number:value}))
            .then(response => {
                let result = response.data.result;
                if (api.V(response.data)) {                    
                    this.setState({
                        id:result.id,
                        name:result.uname,
                        mobile:result.umobile,
                        time:result.last_time,
                        order:result.orders.length,
                        balance:result.merchant_card.cbalance,
                        cname:result.merchant_card.cname              
                    });
                } else {
                    this.props.changeView({view:'register',param:{number:value}});
                }
            });
        }        
    }
    nextStep() {'' !== this.state.id && this.props.changeView({view:'offline_add_item', param:this.state.id})}

    render () {
        return (
            <div className='take'>
                <div><Search placeholder='请输入会员手机号' callback={this.search}/></div>
                <div>
                    <table>
                        <tbody>
                            <tr><td>客户姓名</td><td>{this.state.name}</td></tr>
                            <tr><td>手机号</td><td>{this.state.mobile}</td></tr>
                            <tr><td>会员类型</td><td>{this.state.cname}</td></tr>
                            <tr><td>会员卡余额</td>{'' == this.state.id ? <td></td> : <td>&yen;{this.state.balance}</td>}</tr>
                            <tr>
                                <td>未取订单</td>
                                {
                                    '' == this.state.id
                                    ? 
                                    <td></td> 
                                    : 
                                    <td className='e-orange e-pointer' onClick={() => this.props.changeView({view:'take_off', param:this.state.mobile})}>{this.state.order}</td>
                                }
                            </tr>
                            <tr><td>上次到店时间</td><td>{this.state.time}</td></tr>
                        </tbody>
                    </table>
                </div>
                <div><button type='button' className='e-btn confirm' onClick={this.nextStep}>立即下单</button></div>
            </div>
        );
    }
}