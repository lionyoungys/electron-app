/**
 * 会员余额组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

export default class MemberBalance extends Component{
    constructor(props) {
        super(props);
        this.state = {count:0,total:0};
    }

    render () {
        let props = this.props,
            state = this.state;
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
                        <tr className='ui-tr-d ui-fieldset'>
                            <td>会员卡号</td><td>姓名</td><td>手机号</td><td>会员类型</td><td>余额</td><td className='ui-default'>操作</td>
                        </tr>
                    </tbody>
                </table>
            </section>
            </div>
        );
    }
}