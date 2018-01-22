/**
 * 新增企业会员组件
 * @author yangyunlong
 */
const {ipcRenderer} = window.require('electron');
import React from 'react';
import Crumb from '../UI/crumb/App';
import Gateway from '../UI/gateway/App';
import Pay from '../Ui/pay/App';
import {PayMent} from '../../static/UI';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            uname:'',
            umobile:'',
            cdiscount:'',
            amount:'',
            remark:'',
            addr:'',
            checked:0,
            show:false,
            status:'pay',
            name:'',discount:'',address:'',
            payment:0,isShow:false,
            paymentStatus:'payment',id:null
        };
        this.gateway = [
            'WechatPay_pos',    //微信扫码支付
            'Alipay_AopF2F',    //支付宝扫码付
            'CASH',             //现金支付
        ];
        console.log(this.props.param);
        this.handleClick = this.handleClick.bind(this);
        this.printOrder = this.printOrder.bind(this);
        this.payRequest = this.payRequest.bind(this);
    }

    handleClick() {
        this.setState({show:true});
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
                <Crumb data={[{key:0,value:'会员管理',e:'member'},{key:1,value:'新增企业会员'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div style={{marginBottom:'10px',fontSize:'18px'}}>企业会员信息</div>
                    <table className='m-table' style={{marginBottom:'20px'}}>
                        <tbody className='member-update'>
                            <tr className='bd-lightgrey'>
                                <td>企业名称</td>
                                <td><input type='text' value={this.state.uname} onChange={e => this.setState({uname:e.target.value})}/></td>
                            </tr>
                            <tr className='bd-lightgrey'><td>手机号</td><td>{this.props.param}</td></tr>
                            <tr className='bd-lightgrey'>
                                <td>折扣</td>
                                <td><input type='text' value={this.state.cdiscount} onChange={e => this.setState({cdiscount:e.target.value})}/></td>
                            </tr>
                            <tr className='bd-lightgrey'>
                                <td>充值金额</td>
                                <td><input type='text' value={this.state.amount} onChange={e => this.setState({amount:e.target.value})}/></td>
                            </tr>
                            <tr className='bd-lightgrey'>
                                <td>地址</td>
                                <td><input style={{width:'100%'}} type='text' value={this.state.addr} onChange={e => this.setState({addr:e.target.value})}/></td>
                            </tr>
                            <tr className='bd-lightgrey'>
                                <td>备注</td>
                                <td><input style={{width:'100%'}} type='text' value={this.state.remark} onChange={e => this.setState({remark:e.target.value})}/></td>
                            </tr>
                        </tbody>
                    </table>
                    <Gateway checked={this.state.checked} callback={value => this.setState({checked:value})}/>
                    <div style={{marginTop:'20px'}}>
                        <input type='button' className='m-btn confirm large' value='立即支付' onClick={this.handleClick}/>
                    </div>
                </div>
                <Pay
                    show={this.state.show}
                    status={this.state.status}
                    onClose={() => this.setState({show:false})}
                />
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