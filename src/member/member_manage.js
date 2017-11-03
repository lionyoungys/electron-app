/**
 * 会员管理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs, {Search} from '../static/UI';
const uid = localStorage.getItem('uid');

export default class MemberManage extends Component{
    constructor(props) {
        super(props);
        this.state = {addShow:false,otherShow:false,otherType:0};
        this.onSearchRequest = this.onSearchRequest.bind(this);
    }

    onSearchRequest(word) {
        if (!isNaN(word) && word.length === 11) {
            axios.post(
                api.U('memberDetail'), 
                api.data({token:this.props.token,number:word})
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
                <Crumbs crumbs={[{key:0,text:'会员管理'}]} callback={props.changeView}/>
                <div className='ui-member-manage-container'>
                    <Search placeholder='请输入客户手机号' callback={this.onSearchRequest}/>
                    <div className='ui-member-manage-box'>
                        <div onClick={() => this.props.changeView({element:'member_consume'})}>会员消费报表</div>
                        <div onClick={() => this.props.changeView({element:'member_recharge_record'})}>会员充值报表</div>
                        <div onClick={() => this.props.changeView({element:'member_balance'})}>会员余额</div>
                        <div onClick={() => this.setState({addShow:true})}>新增会员</div>
                        <div onClick={() => this.setState({otherShow:true,otherType:0})}>会员信息变更</div>
                        <div onClick={() => this.setState({otherShow:true,otherType:1})}>会员充值</div>
                    </div>
                </div>
                <AddMember 
                    show={state.addShow} 
                    token={props.token}
                    onCancelRequest={() => this.setState({addShow:false})}
                    changeView={props.changeView}
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
        this.state = {mobile:'',type:0};
        this.onConfirmRequest = this.onConfirmRequest.bind(this);
    }

    onConfirmRequest() {
        let state = this.state;
        if (isNaN(state.mobile) || state.mobile.length !== 11) return;
        axios.post(
            api.U('memberAdd'), 
            api.data({token:this.props.token,uid:uid,mobile:state.mobile})
        )
        .then(response => {
            if (api.verify(response.data)) {
                let param = {ucode:response.data.data.ucode,mobile:state.mobile}
                if (0 === state.type) {
                    this.props.changeView({element:'offline_add_member',param:param});
                } else {
                    this.props.changeView({element:'offline_add_company',param:param});
                }
            }
            console.log(response.data);
        });
    }

    render() {
        let props = this.props,
            state = this.state;
        if (!props.show) return null;
        return (
            <section className='ui-fixed-bg'>
                <div className='ui-mm-add'>
                    <div className='ui-mm-layer-title'>
                        <div className='ui-mm-icon-member'>新增会员</div>
                        <em className='ui-close3' onClick={props.onCancelRequest}></em>
                    </div>
                    <div className='ui-mm-input-area'>
                        手机号：<input type='text' value={state.mobile} onChange={e => this.setState({mobile:e.target.value})}/>
                    </div>
                    <div className='ui-mm-radio-area'>
                        <em 
                            className={'ui-radio' + (0 == state.type ? ' ui-radio-checked' : '')} 
                            style={{marginRight:'46px'}}
                            onClick={e => this.setState({type:0})}
                        >个人会员</em>
                        <em 
                            className={'ui-radio' + (1 == state.type ? ' ui-radio-checked' : '')}
                            onClick={e => this.setState({type:1})}
                        >企业会员</em>
                    </div>
                    <input 
                        type='button' 
                        className='ui-teamwork-confirm' 
                        style={{marginLeft:'46px'}}
                        onClick={this.onConfirmRequest}
                    />
                </div>
            </section>
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
            api.data({token:this.props.token,uid:uid,number:state.mobile})
        )
        .then(response => {
            if (api.verify(response.data)) {
                if (0 == props.type) {
                    props.changeView({element:'member_update_info',param:{id:response.data.data.id}});
                } else {
                    props.changeView({element:'member_recharge',param:{id:response.data.data.id}});
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