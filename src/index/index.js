/**
 * 后台主界面组件 新手请注意，前方高能，请保重
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import menus from './menus';
//界面头部组件
class Header extends Component {
    constructor(props) {super(props);}
    render() {
        return (
            <div id='header'>
                <div id="hleft">速洗达商家管理系统</div>
                <div id="hright">
                    <span id="feedback">意见反馈</span>
                    <span id="password">修改密码</span>
                    <input type="button" value="退出" id="logout"/>
                </div>
            </div>
        );
    }
}
//界面主体容器组件
class Main extends Component {
    constructor(props) {super(props);}
    render() {
        let mainStyle = {
            height:'100%',width:'100%',
            display:'flex',display:'-webkit-flex',
            justifyContent:'space-between'
        };
        return (
            <div style={mainStyle}>
                <Sidebar menus={menus} token={this.props.token}/><View>{this.props.children}</View>
            </div>
        );
    }
}
//侧边栏容器组件
class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {option:null,menu:null};
        this.monitorOption = this.monitorOption.bind(this);
        this.monitorMenu = this.monitorMenu.bind(this);
    }
    monitorOption(option) {this.setState({option:option});}
    monitorMenu(menu) {
        if (this.state.menu == menu) menu = null;
        this.setState({menu:menu});
    }
    render() {
        let menus = this.props.menus.map((obj) => 
            //创建多个菜单组件
            <Menu 
                key={obj.id} 
                id={obj.id}
                selection={obj.selection} 
                options={obj.options} 
                menu={this.state.menu}
                option={this.state.option}
                parentMonitorMenu={this.monitorMenu}
                parentMonitorOption={this.monitorOption}
            />
        );
        return (
            <aside id='sidebar'>
                <Base token={this.props.token}/><div id='nav'>{menus}</div>
            </aside>
        );
    }
}
//右侧视图展示组件
class View extends Component {
    constructor(props) {super(props);}
    render() {
        return (<div id='view'>{this.props.children}</div>);
    }
}
//侧边栏信息状态视图组件
class Base extends Component {
    constructor(props) {
        super(props);
        this.state = {name:null,status:null,logo:null};
        this.statusSwitchover = this.statusSwitchover.bind(this);
    }
    componentDidMount() {
        axios.post(api.U('index'),api.data({token:this.props.token}))
        .then((response)=>{
            let result = response.data.data;
            this.setState({
                name:result.mname,
                status:result.state,
                logo:'url(' +api.host+result.circle_logo+ ')'
            });         
        });
    }
    statusSwitchover() {
        let state = 1 == this.state.status ? 3 : 1;
        axios.post(api.U('statusSwitchover'),api.data({token:this.props.token,state:state}))
        .then((response) => {
            if (api.verify(response.data)) this.setState({status:state});
        });
    }
    render() {
        let isOpen = 1 == this.state.status,
            bg = isOpen ? 'open' : 'close',
            word = isOpen ? '营业中' : '暂停营业';
        return (
            <div id='base'>
                <div id="logo" style={{backgroundImage:this.state.logo}}></div>
                <div id="name">{this.state.name}</div>
                <div id="state" onClick={this.statusSwitchover} className={bg}>{word}</div>
            </div>
        );
    }
}

//菜单视图组件
class Menu extends Component {
    constructor(props) {
        super(props);
        this.chooseOption = this.chooseOption.bind(this);
        this.chooseMenu = this.chooseMenu.bind(this);
    }
    chooseOption(e) {this.props.parentMonitorOption(e.target.dataset.id);}
    chooseMenu(e) {this.props.parentMonitorMenu(this.props.id);}
    render() {
        let sel = this.props.selection,
            opt = this.props.options,
            isSpread = this.props.id == this.props.menu,
            status = isSpread ? 'spread' : 'shrink',    //判断当前大选项是否为选中状态
            optStatus = {display:isSpread ? 'block' : 'none'},
            items = opt.map((obj) => 
                //创建多个选项
                <nav 
                    key={obj.id} 
                    data-id={obj.id}
                    className={this.props.option == obj.id ? 'chosen' : null} 
                    onClick={this.chooseOption}
                >
                    {obj.text}
                </nav>
            );
        return (
            <dl>
                <dt onClick={this.chooseMenu} className='selection'>
                    <div id={sel.id}>{sel.text}</div>
                    <div className={status}></div>
                </dt>
                <dd style={optStatus}>{items}</dd>
            </dl>
        );
    }
}
export default Main;
export {Main,Header};
//ReactDOM.render(<Main menus={menus}/>,document.getElementById('main'));