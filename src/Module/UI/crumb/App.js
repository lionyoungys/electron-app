/**
 * 面包屑组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import './App.css';
//面包屑导航栏 data = [{view:跳转的视图组件,value:文字显示,key:索引key}] callback=回调操作
export default class Crumbs extends Component {
    constructor(props) {super(props);}

    render() {
        let props = this.props,
            list = props.data.map((obj) => 
                <div key={obj.key}>
                    <i>&gt;</i>
                    <span onClick={() => props.callback({view:obj.view, param:obj.param})}>{obj.value}</span>
                </div>
            );
        return (
            <nav className="ui-crumb">
                位置&nbsp;:
                <span onClick={() => props.callback({view:'index'})}>首页</span>{list}
            </nav>
        );
    }
}