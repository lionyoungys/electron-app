/**
 * 会员管理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import Crumb from '../UI/crumb/App';
import Search from '../UI/search/App';
import Radio from '../UI/radio/App';
import './App.css';


export default class extends Component{
    constructor(props) {
        super(props);
        this.state = {addMemberShow:false,otherShow:false,otherType:0};
        this.onSearchRequest = this.onSearchRequest.bind(this);
    }

    onSearchRequest(word) {
        if (!isNaN(word) && word.length === 11) {
            axios.post(
                api.U('memberDetail'), 
                api.D({token:this.props.token,number:word})
            )
            .then(response => {
                if (api.verify(response.data)) {
                    this.props.changeView({element:'member_detail',param:'number=' + word});
                }
            });
        }
    }
    render() {
        let props = this.props,
            state = this.state;
        return (
            <div>
                <Crumb data={[{key:0,value:'会员管理'}]} callback={this.props.changeView}/>
                <div className='member'>
                    <div><Search placeholder='请输入客户手机号' callback={this.onSearchRequest}/></div>
                    <div>
                        <div data-view='member_spend' onClick={this.props.changeView}>会员消费报表</div>
                        <div data-view='member_recharge' onClick={this.props.changeView}>会员充值报表</div>
                        <div data-view='member_balance' onClick={this.props.changeView}>会员余额</div>
                        <div onClick={() => this.setState({addMemberShow:true})}>新增会员</div>
                        <div onClick={() => this.setState({otherShow:true,otherType:0})}>会员信息变更</div>
                        <div onClick={() => this.setState({otherShow:true,otherType:1})}>会员充值</div>
                    </div>
                </div>
                <AddMember 
                    show={this.state.addMemberShow} 
                    token={this.props.token}
                    onClose={() => this.setState({addMemberShow:false})}
                    changeView={this.props.changeView}
                />
                <UpdateOrCharge 
                    show={state.otherShow} 
                    token={props.token}
                    onCancelRequest={() => this.setState({otherShow:false})}
                    type={state.otherType}
                    changeView={props.changeView}
                />
            </div>
        );
    }
}

class AddMember extends Component{
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
                redirect.view = (0 == this.state.type ? 'offline_add_member' : 'offline_add_company');
                this.props.changeView(redirect);
            } else {

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

class UpdateOrCharge extends Component{
    constructor(props) {
        super(props);
        this.state = {mobile:''};
        this.onConfirmRequest = this.onConfirmRequest.bind(this);
    }

    onConfirmRequest() {
        let state = this.state,
            props = this.props;
        if (isNaN(state.mobile) || state.mobile.length !== 11) return;
        axios.post(
            api.U('getUserInfo'), 
            api.D({token:this.props.token,number:state.mobile})
        )
        .then(response => {
            if (api.verify(response.data)) {
                if (0 == props.type) {
                    props.changeView({element:'member_update_info',param:{id:response.data.data.id,number:state.mobile}});
                } else {
                    props.changeView({element:'member_recharge',param:{id:response.data.data.id,number:state.mobile}});
                }
            }
        });
        console.log(state.mobile);
        console.log(props.type); 
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
                            className='ui-teamwork-confirm' 
                            onClick={this.onConfirmRequest}
                        />
                    </div>
                </div>
            </section>
        );
    }
}