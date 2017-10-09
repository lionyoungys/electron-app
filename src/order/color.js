/**
 * 颜色设置
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';
import {colorConfig} from '../static/config';

class Color extends Component {
    constructor(props) {
        console.log(colorConfig);
        super(props);
        this.params = this.props.param.paramToObject();    //参数列表
        this.orderId = this.params.orderId;    //订单ID
        this.id = this.params.id;    //项目ID
        this.color = this.params.color;    //项目内容
        this.crumbs = [
            {text:'订单处理',key:0,e:'order'},
            {text:'衣物检查',key:1,e:'check',param:'id='+this.orderId},
            {text:'颜色设置',key:3}
        ];
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

export default Color;