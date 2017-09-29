import React, {Component} from 'react';
import ReactDOM from 'react-dom';
window.require('../static/api');
const token = localStorage.getItem('token');
class Base extends Component {
    constructor(props) {super(props);}
    render() {
        const baseStyle = {display:'flex',display:'-webkit-flex',flexDirection:'column',alignItems:'center'};
        const logo = {background:'url('+ this.props.logo +')',backgroundSize:'100% 100%'};
        return (
            <div style={baseStyle}>
                <div id="logo" style={logo}></div>
                <div id="name">{this.props.name}</div>
                <div id="state">{this.props.state}</div>
            </div>
        );
    }
}
//新手请注意，前方高能，请保护好自己
//菜单容器组件
class Container extends Component {
    constructor(props) {super(props);}
    render() {
        let menus = this.props.menus.map((obj) => 
            //创建多个菜单组件
            <Menu key={obj.id} selection={obj.selection} option={obj.option}/>
        );
        return (<div id='container'>{menus}</div>);
    }
}
//菜单组件
class Menu extends Component {
    constructor(props) {super(props);}
    render() {
        let sel = this.props.selection,
            opt = this.props.option;
        return (
            <dl>
                <Selection key={sel.id} text={sel.text} id={sel.id} status={sel.status}/>
                <Option key={opt.id} items={opt.items}/>
            </dl>
        );
    }
}
//菜单大选项组件
class Selection extends Component {
    constructor(props) {super(props);}
    render() {
        let status = this.props.status ? 'spread' : 'shrink';    //判断当前大选项是否为选中状态
        return (<dt><div id={this.props.id}>{this.props.text}</div><div className={status}></div></dt>);
    }
}
//菜单详细选项组件
class Option extends Component {
    constructor(props) {super(props);}
    render () {
        console.log(this.props);
        if (this.props.items.length < 1) return null;
        var items = this.props.items.map((obj) => 
            <nav key={obj.id}>{obj.text}</nav>    //创建多个选项
        );
        return (<dd>{items}</dd>);
    }
}
var menus = require('./menu').default;
ReactDOM.render(<Container menus={menus}/>, document.getElementById('nav'));

//获取首页数据并渲染
axios.post(api.U('index'),api.data({token:token}))
.then((response)=>{
    var result = response.data.data;
    ReactDOM.render(
        <Base name={result.mname} state={result.state ? '营业中' : '暂停营业'} logo={api.host+result.circle_logo}/>,
        document.getElementById('base')
    );
});