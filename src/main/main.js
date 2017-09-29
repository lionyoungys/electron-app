import React, {Component} from 'react';
import ReactDOM from 'react-dom';
window.require('../static/api');
const token = localStorage.getItem('token');
class Base extends Component {
    constructor(props) {
        super(props);
        this.state = {name:null,status:null,logo:null};
    }
    componentDidMount() {
        axios.post(api.U('index'),api.data({token:token}))
        .then((response)=>{
            let result = response.data.data;
            this.setState({
                name:result.mname,
                status:1 == result.state ? '营业中' : '暂停营业',
                logo:'url(' +api.host+result.circle_logo+ ')'
            });         
        });
    }
    render() {
        const baseStyle = {display:'flex',display:'-webkit-flex',flexDirection:'column',alignItems:'center'};
        return (
            <div style={baseStyle}>
                <div id="logo" style={{backgroundImage:this.state.logo}}></div>
                <div id="name">{this.state.name}</div>
                <div id="state">{this.state.status}</div>
            </div>
        );
    }
}
//新手请注意，前方高能，请保护好自己
//菜单容器组件
class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {option:null};
        this.listener = this.listener.bind(this);
    }
    listener(option) {this.setState({option:option});}
    render() {
        let menus = this.props.menus.map((obj) => 
            //创建多个菜单组件
            <Menu 
                key={obj.id} 
                selection={obj.selection} 
                options={obj.options} 
                option={this.state.option}
                callbackParent={this.listener}
            />
        );
        return (<div id='container'>{menus}</div>);
    }
}
//菜单视图组件
class Menu extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {this.props.callbackParent(e.target.dataset.id);}
    render() {
        let sel = this.props.selection,
            opt = this.props.options,
            status = sel.status ? 'spread' : 'shrink',    //判断当前大选项是否为选中状态
            items = opt.map((obj) => 
                //创建多个选项
                <nav 
                    key={obj.id} 
                    data-id={obj.id}
                    className={this.props.option == obj.id ? 'chosen' : null} 
                    onClick={this.handleClick}
                >
                    {obj.text}
                </nav>
            );
        return (
            <dl>
                <dt>
                    <div id={sel.id}>{sel.text}</div>
                    <div className={sel.status ? 'spread' : 'shrink'}></div>
                </dt>
                <dd>{items}</dd>
            </dl>
        );
    }
}

var menus = require('./menu').default;
ReactDOM.render(<Container menus={menus}/>, document.getElementById('nav'));
ReactDOM.render(<Base/>,document.getElementById('base'));