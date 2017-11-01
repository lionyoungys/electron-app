/**
 * 会员管理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs, {Search} from '../static/UI';

export default class MemberManage extends Component{
    constructor(props) {
        super(props);
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
        let props = this.props;
        return (
            <div>
                <Crumbs crumbs={[{key:0,text:'会员管理'}]} callback={props.changeView}/>
                <div className='ui-member-manage-container'>
                    <Search placeholder='请输入客户手机号' callback={this.onSearchRequest}/>
                    <div className='ui-member-manage-box'>
                        <div onClick={() => this.props.changeView({element:'member_consume'})}>会员消费报表</div>
                        <div onClick={() => this.props.changeView({element:'member_recharge_record'})}>会员充值报表</div>
                        <div onClick={() => this.props.changeView({element:'member_balance'})}>会员余额</div>
                        <div>新增会员</div>
                        <div>会员信息变更</div>
                        <div>会员充值</div>
                    </div>
                </div>
            </div>
        );
    }
}

class AddMember extends Component{
    constructor(props) {super(props);}

    render() {
        let props = this.props;
        if (!props.show) return null;
        return (
            <section>

            </section>
        );
    }
}