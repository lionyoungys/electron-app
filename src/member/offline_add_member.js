/**
 * 新增个人会员组件
 * @author yangyunlong
 */
const {ipcRenderer} = window.require('electron');
import React, {Component} from 'react';
import '../api';
import Crumbs, {Search, PayMent} from '../static/UI';

export default class OfflineAddMember extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name:'',sex:2,
            birthday:'1980-01-01',address:'',
            remark:'',rechargeType:200,payment:0,
            isShow:false,paymentStatus:'payment',
            id:null,
        };
        console.log(this.props.param);
        this.addMember = this.addMember.bind(this);
        this.payRequest = this.payRequest.bind(this);
        this.printOrder = this.printOrder.bind(this);
    }

    componentDidMount() {
        laydate.render({
            elem:this.input,
            value:'1980-01-01',
            min:'1980-01-01',max:0,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:(value => this.setState({birthday:value}))
        });
    }

    addMember() {
        let state = this.state,
            param = this.props.param;
        if (
            '' != state.name &&
            '' != state.address
        ) {
            axios.post(
                api.U('addNewMember'),
                api.D({
                    token:this.props.token,
                    uid:this.props.uid,
                    ucode:param.ucode,
                    mobile:param.mobile,
                    uname:state.name,
                    sex:state.sex,
                    birthday:state.birthday,
                    address:state.address,
                    remark:state.remark
                })
            )
            .then(response => {
                if (api.verify(response.data)) {
                    let id = response.data.data.user;
                    this.setState({id:id});
                    if (0 == state.payment) {
                        let card_name = '普通会员', discount = 10;
                        if (500 == state.rechargeType) card_name = '黄金会员';discount = 9;
                        if (1000 == state.rechargeType) card_name = '钻石会员';discount = 8;
                        axios.post(
                            api.U('rechargeMerchantCard'),
                            api.D({
                                uid:id,
                                token:this.props.token,
                                card_name:card_name,
                                balance:state.rechargeType,
                                discount:discount,
                                pay_type:'CASH',
                                type:1
                            })
                        )
                        .then(response => {
                            console.log(response.data);
                            if (api.verify(response.data)) {
                                this.printOrder(response.data.data.rechargeId);
                                this.props.changeView({element:'index'});
                            }
                        });
                    } else {
                        this.setState({isShow:true});
                    }
                }
            });
        }
    }

    payRequest(authcode) {
        let state = this.state,
            param = this.props.param;
        this.setState({paymentStatus:'loading'});
        let card_name = '普通会员', discount = 10, pay_type = 'WECHAT';
        if (500 == state.rechargeType) card_name = '黄金会员';discount = 9;
        if (1000 == state.rechargeType) card_name = '钻石会员';discount = 8;
        if (2 == state.payment) pay_type = 'ALI';
        axios.post(
            api.U('rechargeMerchantCard'),
            api.D({
                uid:state.id,
                token:this.props.token,
                card_name:card_name,
                balance:state.rechargeType,
                discount:discount,
                pay_type:pay_type,
                type:1,
                auth_code:authcode,
            })
        )
        .then(response => {
            if (api.verify(response.data)) {
                this.setState({paymentStatus:'success'});
                this.printOrder(response.data.data.rechargeId);
                this.props.changeView({element:'index'});
            }
        });
        //rechargeMerchantCard
    }

    printOrder(rechargeId) {
        let props = this.props;
        ipcRenderer.send(
            'print-silent',
            'public/prints/recharge.html',
            {uid:props.uid,token:props.token,recharge_id:rechargeId}
        );
    }

    render() {
        let props = this.props,
            state = this.state;
        return (
            <div>
                <Crumbs 
                    crumbs={[{key:0,text:'会员管理',e:'member_manage'},{key:1,text:'新增个人会员'}]} 
                    callback={props.changeView}
                />
                <div className='ui-container'>
                    <div style={{marginBottom:'10px',fontSize:'18px'}}>个人会员信息</div>
                    <div className='ui-mcd-row'>
                        <div style={{width:'25%'}}>卡号：{props.param.ucode}</div>
                        <div style={{width:'25%'}}>
                            姓名：
                            <input 
                                type='text' 
                                className='ui-mcd-input' 
                                value={state.name}
                                onChange={e => this.setState({name:e.target.value})}
                            />
                        </div>
                        <div style={{width:'25%'}}>手机号：{props.param.mobile}</div>
                        <div style={{width:'25%'}}>
                            性别：
                            <em 
                                className={'ui-radio' + (2 == state.sex ? ' ui-radio-checked' : '')}
                                onClick={() => this.setState({sex:2})}
                            >女</em>
                            &emsp;&emsp;
                            <em 
                                className={'ui-radio' + (1 == state.sex ? ' ui-radio-checked' : '')}
                                onClick={() => this.setState({sex:1})}
                            >男</em>
                        </div>
                    </div>
                    <div className='ui-mcd-row'>
                        <div style={{width:'25%'}}>
                            生日：
                            <input 
                                type='text' 
                                className='ui-mcd-input' 
                                ref={input => this.input = input}
                                readOnly
                            />
                        </div>
                        <div style={{width:'75%'}}>
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
                    <div style={{padding:'41px 0 25px',fontSize:'18px'}}>会员类型</div>
                    <div className='ui-box'>
                        <div 
                            style={{marginLeft:'37px'}} 
                            className={'ui-recharge-option' + (200 == state.rechargeType ? ' ui-recharge-option-checked' : '')}
                            onClick={e => this.setState({rechargeType:200})}
                        >
                            <div>普通会员</div>
                            <div>200<span>元</span></div>
                            <div>无折扣</div>
                        </div>
                        <div 
                            style={{marginLeft:'37px'}} 
                            className={'ui-recharge-option' + (500 == state.rechargeType ? ' ui-recharge-option-checked' : '')}
                            onClick={e => this.setState({rechargeType:500})}
                        >
                            <div>黄金会员</div>
                            <div>500<span>元</span></div>
                            <div>9折</div>
                        </div>
                        <div 
                            style={{marginLeft:'37px'}} 
                            className={'ui-recharge-option' + (1000 == state.rechargeType ? ' ui-recharge-option-checked' : '')}
                            onClick={e => this.setState({rechargeType:1000})}
                        >
                            <div>钻石会员</div>
                            <div>1000<span>元</span></div>
                            <div>8折</div>
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
                        <input type='button' className='ui-btn ui-btn-confirm ui-btn-large' value='立即支付' onClick={this.addMember}/>
                    </div>
                </div>
                <PayMent 
                    isShow={state.isShow}
                    status={state.paymentStatus}
                    amount={state.rechargeType}
                    free='免洗订单将不会支付任何金额，此订单确定免洗吗？'
                    onCancelRequest={() => this.setState({isShow:false,paymentStatus:'payment'})}
                    onConfirmRequest={this.payRequest}
                />
            </div>
        );
    }
}