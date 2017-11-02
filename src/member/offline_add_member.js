/**
 * 新增个人会员组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs, {Search} from '../static/UI';

export default class OfflineAddMember extends Component{
    constructor(props) {
        super(props);
        console.log(this.props.param);
    }

    render() {
        let props = this.props;
        return (
            <div>
                <Crumbs 
                    crumbs={[{key:0,text:'会员管理',e:'member_manage'},{key:1,text:'新增个人会员'}]} 
                    callback={props.changeView}
                />
            </div>
        );
    }
}