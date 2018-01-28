/**
 * 会员管理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import Crumb from '../UI/crumb/App';
import Search from '../UI/search/App';
import {AddMember, UpdateOrCharge} from '../UI/member-toast/App';
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
                if (api.V(response.data)) {
                    this.props.changeView({element:'member_detail',param:'number=' + word});
                }
            });
        }
    }
    render() {
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