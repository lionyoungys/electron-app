/**
 * 会员管理弹窗组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import Radio from '../radio/App';

export class AddMember extends Component{
    constructor(props) {
        super(props);
        this.state = {mobile:'', type:0};
        this.onConfirmRequest = this.onConfirmRequest.bind(this);
        this.handleClose = this.handleClose.bind(this);   
    }
    handleClose() {
        this.setState({mobile:'',type:0});
        this.props.onClose();
    }

    onConfirmRequest() {
        let mobile = this.state.mobile;
        if (isNaN(mobile) || mobile.length !== 11) return;
        axios.post(api.U('whether_add'), api.D({token:this.props.token,number:mobile}))
        .then(response => {
            if (api.V(response.data)) {
                let redirect = {param:mobile};
                redirect.view = (0 == this.state.type ? 'member_add_user' : 'member_add_company');
                this.props.changeView(redirect);
            } else {
                alert(response.data.msg);
            }
            console.log(response.data);
        });
    }

    render() {
        let props = this.props,
            state = this.state;
        if (!this.props.show) return null;
        return (
            <div className='m-layer-bg'>
                <div className='add-member'>
                    <i className='m-close' onClick={this.handleClose}></i>
                    <div className='m-bg-linear'><span className='m-add-member'>新增会员</span></div>
                    <div>
                        手机号：<input type='text' value={this.state.mobile} onChange={e => this.setState({mobile:e.target.value})}/>
                    </div>
                    <div>
                        <Radio checked={0 == this.state.type} value='0' onClick={value => this.setState({type:value})}>个人会员</Radio>
                        &emsp;&emsp;
                        <Radio checked={1 == this.state.type} value='1' onClick={value => this.setState({type:value})}>企业会员</Radio>
                    </div>
                    <div><button className='m-btn middle gradient lightblue' onClick={this.onConfirmRequest}>确认</button></div>
                </div>
            </div>
        );
    }
}

export class UpdateOrCharge extends Component{
    constructor(props) {
        super(props);
        this.state = {mobile:''};
        this.onConfirmRequest = this.onConfirmRequest.bind(this);
    }

    onConfirmRequest() {
        if (isNaN(this.state.mobile) || this.state.mobile.length !== 11) return;
        axios.post(api.U('member'), api.D({token:this.props.token,number:this.state.mobile}))
        .then(response => {
            if (api.V(response.data)) {
                if (0 == this.props.type) {
                    this.props.changeView({view:'member_update',param:this.state.mobile});
                } else {
                    this.props.changeView({view:'recharge',param:this.state.mobile});
                }
            } else {
                alert('会员不存在!');
            }
        });
    }

    render() {
        let props = this.props,
            state = this.state;
        if (!props.show) return null;

        return (
            <section className='ui-fixed-bg'>
                <div className='ui-mm-upd'>
                    <div className='ui-mm-layer-title'>
                        <div className={0 == props.type ? 'ui-mm-icon-info' : 'ui-mm-icon-money'}>
                            {0 == props.type ? '会员信息变更' : '会员充值'}
                        </div>
                        <em className='ui-close3' onClick={e => {this.setState({mobile:''});props.onCancelRequest();}}></em>
                    </div>
                    <div 
                        style={{padding:'34px 0 21px',textAlign:'center',fontSize:'16px',color:'#333'}}
                    >请输入会员手机号</div>
                    <div style={{marginBottom:'21px',textAlign:'center'}}>
                        <input 
                            type='text' 
                            style={{width:'228px',height:'33px',border:'1px solid #e0e7eb',fontSize:'16px',lineHeight:'33px'}}
                            value={state.mobile}
                            onChange={e => this.setState({mobile:e.target.value})}
                        />
                    </div>    
                    <div style={{textAlign:'center'}}>
                        <input 
                            type='button' 
                            className='m-btn middle gradient lightblue'
                            value='确认'
                            onClick={this.onConfirmRequest}
                        />
                    </div>
                </div>
            </section>
        );
    }
}