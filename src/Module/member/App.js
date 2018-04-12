/**
 * 会员管理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import Search from '../UI/search/App';
import {AddMember, UpdateOrCharge} from '../UI/member-toast/App';
import './App.css';


export default class extends Component{
    constructor(props) {
        super(props);
        this.state = {addMemberShow:false,otherShow:false,otherType:0};
        this.onSearchRequest = this.onSearchRequest.bind(this);
    }

    onSearchRequest(value) {
        if (!isNaN(value) && value.length === 11) {
            api.post('member_detail', {token:this.props.token,umobile:value}, (response, verify) => {
                if (verify) {
                    this.props.changeView({view:'member_detail',param:value});
                } else {
                    alert(response.data.msg);
                }
            })
        }
    }
    render() {
        return (
            <div>
                <div className='member'>
                    <div><Search placeholder='请输入客户手机号' callback={this.onSearchRequest}/></div>
                    <div>
                        <div data-view='member_spend' onClick={this.props.changeView}>会员消费报表</div>
                        <div data-view='member_recharge' onClick={this.props.changeView}>会员充值报表</div>
                        <div data-view='member_balance' onClick={this.props.changeView}>会员余额</div>
                        <div onClick={() => this.setState({addMemberShow:true})}>新增会员</div>
                        <div onClick={() => this.setState({otherShow:true,otherType:0})}>会员信息变更</div>
                        <div onClick={() => this.setState({otherShow:true,otherType:1})}>会员充值</div>
                        <div onClick={this.props.changeView} data-view='change_card'>老用户换卡</div>
                    </div>
                </div>
                <AddMember 
                    show={this.state.addMemberShow} 
                    token={this.props.token}
                    onClose={() => this.setState({addMemberShow:false})}
                    changeView={this.props.changeView}
                />
                <UpdateOrCharge 
                    show={this.state.otherShow} 
                    token={this.props.token}
                    onCancelRequest={() => this.setState({otherShow:false})}
                    type={this.state.otherType}
                    changeView={this.props.changeView}
                />
            </div>
        );
    }
}