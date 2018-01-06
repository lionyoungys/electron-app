/**
 * 后台主界面组件
 * @author yangyunlong
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {MyChart} from './static/UI';
import menus from './menus';
import route from './route';
import './api';
import './main.css';
import './media.css';    //媒体查询相应式处理css
const Passwd = route.passwd;    //修改密码组件
const Feedback = route.feedback;    //用户反馈

const token = localStorage.getItem('token'),
      auth = localStorage.getItem('auth'),
      isRoot = localStorage.getItem('is_root'),
      branch = 'master';    //当前项目分支

//界面主体容器组件
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:null,status:null,logo:null,amount:null,count:null,    //数据状态
            option:null,  //菜单栏样式状态
            view:'index',param:null    //右侧展示样式状态 附带参数
        };
        this.interval = null;
        this.changeView = this.changeView.bind(this);
        this.toggle = this.toggle.bind(this);
    }
    //获取店铺状态数据
    componentDidMount() {
        axios.post(api.U('index'),api.D({token:token}))
        .then(response => {
            let result = response.data.result;
            this.setState({
                name:result.mname,    //店铺名称
                status:(10 == result.mstatus ? 1 : 0),    //店铺状态   10营业中，11休息
                logo:result.mlogo,    //店铺头像
                amount:result.amount,    //今日营业总额
                count:result.order_count    //有效订单
            });         
        });
        setInterval(() => {
            axios.post(api.U('index'),api.D({token:token}))
            .then((response)=>{
                let result = response.data.result;
                this.setState({count:result.order_count});         
            });
        }, 60000);
    }

    componentWillUnmount() {
        null !== this.interval && clearInterval(this.interval);
    }
    //营业状态切换
    toggle() {
        let status = (this.state.status ? 0 : 1);    //操作当前店铺状态时，获取当前店铺状态并取反
        axios.post(api.U('toggle'),api.D({token:token,open:status}))
        .then(response => {        	
            if (api.V(response.data)) this.setState({status:status});
        });
    }
    //右侧界面动态转换事件方法
    changeView(e) {
        if ('undefined' === typeof e.target) {
            this.setState({view:e.view,param:e.param});
        } else {
            let data = e.target.dataset;
            'undefined' !== typeof data.view && this.state.view != data.view && this.setState({view:data.view});
            'undefined' !== typeof data.option && this.setState({option:data.option});
            'undefined' !== typeof data.param && this.setState({param:data.param});
        }
    }

    render() {
        let state = this.state,
            props = this.props,
            list = menus.map((obj) =>     //创建多个菜单组件
            <Menu 
                key={obj.id}
                id={obj.id}
                text={obj.text}
                count={state.count}
                options={obj.options} 
                option={state.option}
                changeView={this.changeView}
            />
        );
        let E = route[state.view];   //展示指定视图组件
        return (
            <div id='main'>
                <Header/>
                {/* 左侧菜单栏容器 */}
                <aside>
                    <div>
                        {/* 信息展示组件 */}
                        <Status name={state.name} status={state.status} logo={state.logo} toggle={this.toggle}/>
                        {/* 导航容器组件及导航栏视图组件 */}
                        <div id='menu'>{list}</div>
                    </div>
                </aside>
                {/* 右侧视图容器 */}
                    <E 
                        token={token} 
                        param={state.param}
                        changeView={this.changeView}
                        branch={branch}
                    />
            </div>
        );
    }
}

//界面头部组件
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {feedbackShow:false,passwdShow:false};
        this.toggleFeedbackShow = this.toggleFeedbackShow.bind(this);
        this.togglePasswdShow = this.togglePasswdShow.bind(this);
    }
    toggleFeedbackShow() {this.setState({feedbackShow:!this.state.feedbackShow});}
    togglePasswdShow() {this.setState({passwdShow:!this.state.passwdShow});}
    render() {
        let state = this.state;
        return (
            <header>
                <div>速洗达商家管理系统</div>
                <div>      
                    <span onClick={this.toggleFeedbackShow}>
                        <i className="fa fa-pencil-square"></i>&nbsp;意见反馈
                    </span>
                    <span onClick={this.togglePasswdShow}>
                        <i className="fa fa-lock"></i>&nbsp;修改密码
                    </span>
                </div>
                <Passwd
                    show={state.passwdShow} 
                    onCancelRequest={this.togglePasswdShow} 
                    token={token}
                />
                <Feedback
                    show={state.feedbackShow} 
                    onCancelRequest={this.toggleFeedbackShow} 
                    token={token}
                />
            </header>
        );
    }
}

//侧边栏信息状态视图组件
class Status extends Component {
    constructor(props) {super(props)}
    render() {
        let props = this.props,
            word = ( props.status ? '营业中' : '休息中' ),
            style = ( "toggle " + (props.status ? 'toggle-on' : 'toggle-off') ),
            handle = ( 1 == isRoot ? props.toggle : null );
        return (
            <div id='status'>
                <div><img src={props.logo}/></div>
                <div>{props.name}</div>
                <div onClick={handle}>
                    {1 == isRoot ? <i className={style}>{word}</i> : <i className="toggle">{word}</i>}
                </div>
            </div>
        );
    }
}
//侧边栏菜单视图组件
class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {isUp:true}
    }

    render() {
        let props = this.props,
            isUp = this.state.isUp,
            isShowOrders = 'order' == props.id && props.orders > 0,
            tag = ('order' == props.id ? <i className='tag'>10</i> : null),
            status = isUp ? 'main-shrink' : 'main-spread',    //判断当前大选项是否为选中状态
            optStatus = {display:isUp ? 'none' : 'block'},
            options = props.options.map((obj) => 
                //创建多个选项
                <dd
                    key={obj.key}
                    data-option={obj.key}
                    data-view={obj.key}
                    className={props.option == obj.key ? 'option-choose' : null}
                    onClick={props.changeView}
                    style={optStatus}
                >
                    {obj.text}&emsp;&emsp;{tag}
                </dd>
            );
        return (
            <dl>
                <dt onClick={() => this.setState({isUp:!this.state.isUp})}>
                    <i id={props.id}>{props.text}</i>
                    <i className={isUp ? 'menu-up' : 'menu-down'}></i>
                </dt>
                {options}
            </dl>
        );
    }
}

ReactDOM.render(<Main/>,document.getElementById('root'));