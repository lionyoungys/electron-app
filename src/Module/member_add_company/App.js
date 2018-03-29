/**
 * 新增企业会员组件
 * @author yangyunlong
 */
const {ipcRenderer} = window.require('electron');
import React from 'react';
import Gateway from '../UI/gateway/App';
import Pay from '../UI/pay/App';

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
            status:'pay'
        };
        this.gateway = [
            'CASH',             //现金支付
            'WechatPay_Pos',    //微信扫码支付
            'Alipay_AopF2F'    //支付宝扫码付
        ];
        this.onConfirm = this.onConfirm.bind(this);
        this.submit = this.submit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.printOrder = this.printOrder.bind(this);
        this.payRequest = this.payRequest.bind(this);
    }
    onConfirm(authCode) {
        this.setState({status:'loading'});
        this.submit(authCode);
    }

    submit(authCode) {
        authCode = tool.isSet(authCode) ? authCode : '1';
        axios.post(
            api.U('company_add'),
            api.D({
                token:this.props.token,
                umobile:this.props.param,
                uname:this.state.uname,
                reg_from:4,
                auth_code:authCode,
                cdiscount:this.state.cdiscount,
                amount:this.state.amount,
                remark:this.state.remark,
                addr:this.state.addr,
                gateway:this.gateway[this.state.checked]
            })
        )
        .then(response => {
            if (api.V(response.data)) {
                ipcRenderer.send(
                    'print-silent',
                    'public/prints/recharge.html',
                    {token:this.props.token,record_id:response.data.result,url:api.U('recharge_print')}
                );
                this.props.changeView({view:'index'});
            } else {
                if (0 != this.state.checked) {
                    this.setState({status:'fail'});
                }
            }
        });
    }

    handleClick() {
        if (
            '' == this.state.uname
            ||
            isNaN(this.state.cdiscount)
            ||
            isNaN(this.state.amount)
            ||
            this.state.amount < 0
            ||
            this.state.cdiscount > 10
            ||
            this.state.cdiscount < 0.1
        ) return;
        if (0 != this.state.checked) {
            this.setState({show:true});
        } else {
            this.submit();
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
                    amount={this.state.amount}
                    status={this.state.status}
                    onClose={() => this.setState({show:false,status:'pay'})}
                    onConfirm={this.onConfirm}
                />
            </div>
        );
    }
}