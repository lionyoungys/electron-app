/**
 * 订单支付组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

class Pay extends Component {
    constructor(props) {
        super(props);
        this.crumbs = [
            {text:'收衣',key:0,e:'take'},
            {text:'添加项目',key:1,e:'item',param:this.props.param},
            {text:'工艺加价',key:2,e:'craft',param:this.props.param},
            {text:'衣物检查',key:3,e:'check',param:this.props.param},
            {text:'订单支付',key:4}
        ];
    }

    render() {
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={this.props.changeView}/>

            </div>
        );
    }
}

export default Pay;