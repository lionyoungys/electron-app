/**
 * 新增企业会员组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs, {Search} from '../static/UI';

export default class OfflineAddCompany extends Component{
    constructor(props) {
        super(props);
        this.state = {name:'',discount:'',amount:'',address:'',remark:'',payment:0};
        console.log(this.props.param);
    }
    render() {
        let props = this.props,
            state = this.state;
        return (
            <div>
                <Crumbs 
                    crumbs={[{key:0,text:'会员管理',e:'member_manage'},{key:1,text:'新增企业会员'}]} 
                    callback={props.changeView}
                />
                <div className='ui-container'>
                    <div style={{marginBottom:'10px',fontSize:'18px'}}>企业会员信息</div>
                    <div className='ui-mcd-row'>
                        <div style={{width:'25%'}}>卡号：{props.param.ucode}</div>
                        <div style={{width:'25%'}}>
                            企业名称：
                            <input 
                                type='text' 
                                className='ui-mcd-input' 
                                value={state.name}
                                onChange={e => this.setState({name:e.target.value})}
                            /></div>
                        <div style={{width:'25%'}}>手机号：{props.param.mobile}</div>
                        <div style={{width:'25%'}}>
                            折扣：
                            <input 
                                type='text' 
                                className='ui-mcd-input' 
                                value={state.discount}
                                onChange={e => this.setState({discount:e.target.value})}
                            />折
                        </div>
                    </div>
                    <div className='ui-mcd-row'>
                        <div style={{width:'35%'}}>
                            充值金额：
                            <input 
                                type='text' 
                                className='ui-mcd-input' 
                                value={state.amount}
                                onChange={e => this.setState({amount:e.target.value})}
                            />
                        </div>
                        <div style={{width:'65%'}}>
                            地址：
                            <input 
                                type='text' 
                                className='ui-mcd-input' 
                                style={{width:'80%'}}
                                value={state.address}
                                onChange={e => {this.setState({address:e.target.value})}}
                            />
                        </div>
                    </div>
                    <div className='ui-mcd-row'>
                        <div style={{width:'100%'}}>
                            备注：
                            <input 
                                type='text' 
                                className='ui-mcd-input' 
                                style={{width:'80%'}}
                                value={state.remark}
                                onChange={e => this.setState({remark:e.target.value})}
                            />
                        </div>
                    </div>
                    <div style={{padding:'42px 0 22px',fontSize:'18px'}}>选择支付方式：</div>
                    <div className='ui-recharge-box'>
                        <section 
                            className={'ui-checkbox2' + (0 == state.payment ? ' ui-checked2' : '')} 
                            onClick={() => this.setState({payment:0})}
                        ><em className='ui-pay-icon-cash'></em><span className='ui-pay-payment'>现金支付</span></section>
                        <section 
                            className={'ui-checkbox2' + (1 == state.payment ? ' ui-checked2' : '')} 
                            onClick={() => this.setState({payment:1})}
                        ><em className='ui-pay-icon-wechat'></em><span className='ui-pay-payment'>微信支付</span></section>
                        <section 
                            className={'ui-checkbox2' + (2 == state.payment ? ' ui-checked2' : '')} 
                            onClick={() => this.setState({payment:2})}
                        ><em className='ui-pay-icon-alipay'></em><span className='ui-pay-payment'>支付宝支付</span></section>
                    </div>
                    <div style={{marginTop:'32px'}}>
                        <input type='button' className='ui-btn ui-btn-confirm ui-btn-large' value='立即支付'/>
                    </div>
                </div>
            </div>
        );
    }
}