/**
 * 会员充值报表组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

export default class MemberRechargeRecord extends Component{
    constructor(props) {super(props);}

    render () {
        let props = this.props;
        return (
            <div>
                <Crumbs crumbs={[{key:0,text:'会员管理',e:'member_manage'},{key:1,text:'会员充值报表'}]} callback={props.changeView}/>
                <section className='ui-container'>
                    
                </section>
            </div>
        );
    }
}