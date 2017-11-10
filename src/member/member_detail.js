/**
 * 会员详情组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

export default class MemberDetail extends Component{
    constructor(props) {
        super(props);
        if ('object' === typeof this.props.param) {
            this.params = this.props.param;
        } else {
            this.params = this.props.param.paramToObject();
        }
        
        this.state = {user:{},record:[]};
    }

    componentDidMount() {
        axios.post(
            api.U('memberDetail'), 
            api.data({token:this.props.token,number:this.params.number})
        )
        .then(response => {
            let result = response.data.data;
            this.setState({user:result.user,record:result.record})
            console.log(result);
        });
    }

    render() {
        let props = this.props,
            user = this.state.user,
            record = this.state.record,
            html = record.map(obj =>
                <div className='ui-md-row' key={obj.id}>
                    <div>
                        <span>{1 == obj.type ? '会员充值' : '会员洗衣消费'}</span>
                        <span>{obj.update_time}</span>
                    </div>
                    <div>{1 == obj.type ? '' : '-'}&yen;{obj.amount}</div>
                </div>
            );
        return (
            <div>
                <Crumbs crumbs={[{key:0,text:'会员管理',e:'member_manage'},{key:1,text:'会员详情'}]} callback={props.changeView}/>
                <section className='ui-md-box'>
                    <div><span>卡号：</span><span>{user.ucode}</span></div>
                    <div><span>姓名：</span><span>{user.username}</span></div>
                    <div><span>性别：</span><span>{1 == user.sex ? '男' : '女'}</span></div>
                    <div><span>会员类型：</span><span>{user.card_name}</span></div>
                    <div><span>手机号：</span><span>{user.mobile_number}</span></div>
                    <div><span>会员余额：</span><span className='ui-red'>&yen;{user.balance}</span></div>
                    <div><span>会员折扣：</span><span>{user.discount}</span></div>
                    <div><span>会员生日：</span><span>{user.birthday}</span></div>
                    <div><span>办理时间：</span><span>{Number(user.register_time).dateFormat('datetime', '.')}</span></div>
                    <div><span>会员地址：</span><span>{user.address}</span></div>
                    <div><span>备注：</span><span>{user.remark}</span></div>
                </section>
                <div className='ui-md-partition'>余额明细</div>
                {html}
            </div>
        );
    }
}