/**
 * 工艺加价组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs, {Tabs,Math} from '../static/UI';

class Craft extends Component{
    constructor(props) {
        super(props);
        this.crumbs = [
            {text:'订单处理',key:0,e:'order'},
            {text:'添加项目',key:1,e:'item',param:this.props.param},
            {text:'工艺加价',key:2}
        ];    //面包屑参数
    }

    render() {
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={this.props.changeView}/>
            </div>
        );
    }
}
export default Craft;