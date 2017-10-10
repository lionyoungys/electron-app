/**
 * 新增会员组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

class AddMember extends Component {
    constructor(props) {
        super(props);
        this.crumbs = [{key:0,text:'收衣',e:'take'},{key:1,text:'散客信息'}];
    }

    render() {
        let props = this.props;
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={props.changeView}/>
            </div>
        );
    }
}

export default AddMember;