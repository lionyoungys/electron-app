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
                    <span data-e={obj.e} onClick={props.callbackParent}>{obj.text}</span>
                </div>
            );
        return (
            <nav id="crumbs">
                位置&nbsp;:
                <span data-e={index} onClick={props.callbackParent}>首页</span>{items}
            </nav>
        );
    }
}
//
class Tabs extends Component {
    constructor(props) {super(props);}
    render() {
        let props = this.props,
            tabs = this.props.tabs;
        if ('undefined' === typeof tabs || tabs.length < 1) return null;
        let items = tabs.map((obj) => 
                    <div key={obj.key} 
                         data-e={obj.e}
                         data-key={obj.key}
                         className={props.choose==obj.key?'ui-tab ui-tab-chosen':'ui-tab'}
                         onClick={props.callbackParent}
                    >
                        {obj.text}
                    </div>
                );
        return(<div>{items}</div>);
    }
}
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {word:null};
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({word:e.target.value});
    }
    render() {
        let props = this.props,
            state = this.state,
            button = 'undefined' === typeof props.button ? '搜索' : props.button
        return (
            <div className='ui-search'>
                <input type='text' placeholder={props.placeholder} onChange={this.handleChange}/>
                <input type='button' value={button} data-word={state.word} onClick={props.callbackParent}/>
            </div>
        );
    }
}
//提示框 宽180px 高30px param:text=提示信息    
class Notice extends Component {
    constructor(props) {super(props);}
    render() {
        let props = this.props,
            top = 'undefined' === typeof props.top ? 'calc((100% - 30px) / 2)' : props.top,
            style = {
                color:'rgb(255,255,255)',background:'black',borderRadius:'3px',fontSize:'16px',
                height:'30px',lineHeight:'30px',width:'180px',textAlign:'center',
                display:this.props.display ? 'inline-block' : 'none',overflow:'hidden',
                position:'fixed',left:'calc((100% - 180px) / 2)',top:top
            };
        return (<div style={style}>{this.props.text}</div>);
    }
}
export default Crumbs;
export {Tabs,Search,Notice};