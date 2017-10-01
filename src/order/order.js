/**
 * 订单处理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';
class Pending extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let list = [{text:'订单处理',key:1}];
        return (
            <div>
                <Crumbs list={list} changeView={this.props.changeView}/>
            </div>
        );
    }
}

export default Pending;