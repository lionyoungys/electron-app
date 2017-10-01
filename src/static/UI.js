/**
 * UI组件库
 * @author yangyunlong
 */
import React, {Component} from 'react';
import './UI.css';
//面包屑导航栏 list = [{key:索引key,e:跳转的视图组件,text:文字显示}] [index=首页跳转]
class Crumbs extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let props = this.props,
            index = 'undefined' === typeof props.index ? 'index' : props.index,
            items = props.list.map((obj) => 
                <div key={obj.key}>
                    <em>&gt;</em>
                    <span data-e={obj.e} onClick={props.changeView}>{obj.text}</span>
                </div>
            );
        return (
            <nav id="crumbs">
                位置&nbsp;:
                <span data-e={index} onClick={props.changeView}>首页</span>{items}
            </nav>
        );
    }
}
//宽180px 高30px 提示框 param:text=提示信息    
class Notice extends Component {
    constructor(props) {super(props);this.top = 'undefined' === typeof this.props.top ? 0 : this.props.top;}
    render() {
        let style = {
            color:'rgb(255,255,255)',background:'black',borderRadius:'3px',fontSize:'16px',
            height:'30px',lineHeight:'30px',width:'180px',textAlign:'center',
            display:this.props.display ? 'inline-block' : 'none',
            overflow:'hidden',
            position:'fixed',left:'calc((100% - 180px) / 2)',top:this.top
        };
        return (<div style={style}>{this.props.text}</div>);
    }
}
export default Crumbs;
export {Notice};