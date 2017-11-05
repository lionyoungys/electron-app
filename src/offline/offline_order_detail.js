/**
 * 线下业务统计组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

export default class OfflineOrderDetail extends Component{
    constructor(props) {
        super(props);
        this.params = this.props.param;
        console.log(this.params);
    }

    render() {
        let props = this.props,
            state = this.state;
        render (
            <div>
                <Crumbs 
                    crumbs={[{key:0,text:'业务统计',e:'offline_statistic'},{key:1,text:'订单详情'}]} 
                    callback={props.changeView}
                />
            </div>
        );
    }
}