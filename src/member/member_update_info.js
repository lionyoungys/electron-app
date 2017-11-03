/**
 * 新增企业会员组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs, {Search} from '../static/UI';

export default class MemberUpdateInfo extends Component{
    constructor(props) {super(props);}

    render() {
        let props = this.props,
            state = this.state;
        return (
            <div>
                <Crumbs 
                    crumbs={[{key:0,text:'会员管理',e:'member_manage'},{key:1,text:'会员信息变更'}]} 
                    callback={props.changeView}
                />
                <section className='ui-container'>

                </section>
            </div>
        );
    }
}