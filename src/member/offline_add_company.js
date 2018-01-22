/**
 * 新增企业会员组件
 * @author yangyunlong
 */
const {ipcRenderer} = window.require('electron');
import React, {Component} from 'react';
import Crumbs, {Search, PayMent} from '../static/UI';

export default class OfflineAddCompany extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name:'',discount:'',amount:'',address:'',
            remark:'',payment:0,isShow:false,
            paymentStatus:'payment',id:null
        };
        console.log(this.props.param);
        this.handleClick = this.handleClick.bind(this);
        this.printOrder = this.printOrder.bind(this);
        this.payRequest = this.payRequest.bind(this);
    }

    handleClick() {
        let state = this.state,
            param = this.props.param;
        if (
            '' != state.name &&
            '' != state.address &&
            !isNaN(state.discount) && 10 > state.discount && 0 < state.discount &&
            !isNaN(state.amount) && state.amount > 0 &&
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
                    address:state.address,
                    remark:state.remark,
                    type: 2
                })
            )
            .then(response => {
                if (api.verify(response.data)) {
                    let id = response.data.data.user;
                    this.setState({id:id});
                    if (0 == state.payment) {
                    axios.post(
                        api.U('rechargeMerchantCard'),
                        api.D({
                            uid:id,
                            token:this.props.token,
                            card_name:'企业会员',
                            balance:state.amount,
                            discount:state.discount,
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
        let pay_type = 'WECHAT';
        if (2 == state.payment) pay_type = 'ALI';
        axios.post(
            api.U('rechargeMerchantCard'),
            api.D({
                uid:state.id,
                token:this.props.token,
                card_name:'企业会员',
                balance:state.amount,
                discount:state.discount,
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
                        <input type='button' className='ui-btn ui-btn-confirm ui-btn-large' value='立即支付' onClick={this.handleClick}/>
                    </div>
                </div>
                <PayMent 
                    isShow={state.isShow}
                    status={state.paymentStatus}
                    amount={state.amount}
                    free='免洗订单将不会支付任何金额，此订单确定免洗吗？'
                    onCancelRequest={() => this.setState({isShow:false,paymentStatus:'payment'})}
                    onConfirmRequest={this.payRequest}
                />
            </div>
        );
    }
}