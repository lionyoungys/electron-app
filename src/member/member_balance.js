/**
 * 会员余额组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs,{Page} from '../static/UI';

export default class MemberBalance extends Component{
    constructor(props) {
        super(props);
        this.state = {count:0,total:0,page:1,page_count:1,data:[]};
        this.limit = 20;
        this.togglePage = this.togglePage.bind(this);
    }

    componentDidMount() {
        axios.post(
            api.U('memberBalanceList'),
            api.D({token:this.props.token,limit:this.limit,page:this.state.page})
        )
        .then(response => {
            let result = response.data.data;
            this.setState({
                count:result.member_count,
                total:result.member_total_balance,
                page_count:result.page_count,
                data:result.member_list
            });
        });
    }

    togglePage(page) {
        axios.post(
            api.U('memberBalanceList'),
            api.D({token:this.props.token,limit:this.limit,page:page})
        )
        .then(response => {
            let result = response.data.data;
            this.setState({
                count:result.member_count,
                total:result.member_total_balance,
                page_count:result.page_count,
                data:result.member_list,
                page:page,
            });
        });
    }

    render () {
        let props = this.props,
            state = this.state,
            html = state.data.map(obj => 
                <tr className='ui-tr-d ui-fieldset' key={obj.ucode}>
                    <td>{obj.ucode}</td>
                    <td>{obj.username}</td>
                    <td>{obj.mobile}</td>
                    <td>{obj.card_name}</td>
                    <td>{obj.balance}</td>
                    <td className='ui-default' onClick={()=>{this.props.changeView({element:'member_detail',param:{number:obj.ucode}})}}>查看详情</td>
                </tr>
            );
        return (
            <div>
                <Crumbs crumbs={[{key:0,text:'会员管理',e:'member_manage'},{key:1,text:'会员余额'}]} callback={props.changeView}/>
                <section className='ui-container'>
                <div className='ui-box' style={{fontSize:'18px',padding:'20px 0'}}>
                    <div style={{paddingRight:'50px'}}>累计会员数：<span style={{fontSize:'24px'}}>{state.count}</span></div>
                    <div>累计会员金额：<span style={{fontSize:'24px'}}>&yen;{state.total}</span></div>
                </div>
                <table className='ui-table'>
                    <thead><tr className='ui-tr-h ui-fieldset'>
                        <th>会员卡号</th><th>姓名</th><th>手机号</th><th>会员类型</th><th>余额</th><th>操作</th>
                    </tr></thead>
                    <tbody>
                        {html}
                    </tbody>
                </table>
                <Page count={state.page_count} current={state.page} callback={this.togglePage}/>
                </section>
            </div>
        );
    }
}