/**
 * 后台主界面组件
 * @author yangyunlong
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import './api';
import {MyChart} from './static/UI';
import {FeedBack,UpdatePassword} from './main_layer';
import menus from './menus';
import route from './route';

const token = localStorage.getItem('token'),
      auth = localStorage.getItem('auth'),
      isRoot = localStorage.getItem('is_root'),
      branch = 'master';    //当前项目分支

//界面头部组件
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {feedbackShow:false,updatePasswordShow:false};
        this.toggleFeedback = this.toggleFeedback.bind(this);
        this.toggleUpdatePassword = this.toggleUpdatePassword.bind(this);
    }
    toggleFeedback() {this.setState({feedbackShow:!this.state.feedbackShow});}
    toggleUpdatePassword() {this.setState({updatePasswordShow:!this.state.updatePasswordShow});}
    render() {
        let state = this.state;
        return (
            <header>
                <div>速洗达商家管理系统</div>
                <div>      
                    <span onClick={this.toggleFeedback}>
                        <i className="fa fa-pencil-square"></i>&nbsp;意见反馈
                    </span>
                    <span onClick={this.toggleUpdatePassword}>
                        <i className="fa fa-lock"></i>&nbsp;修改密码
                    </span>
                </div>
                {/* <FeedBack 
                    show={state.feedbackShow} 
                    onCancelRequest={this.toggleFeedback} 
                    token={token}
                />
                <UpdatePassword 
                    show={state.updatePasswordShow} 
                    onCancelRequest={this.toggleUpdatePassword} 
                    token={token}
                    uid={uid}
                /> */}
            </header>
        );
    }
}
//界面主体容器组件
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:null,status:null,logo:null,amount:null,count:null,    //数据状态
            option:null,  //菜单栏样式状态
            e:'index',param:null    //右侧展示样式状态 附带参数
        };
        route.index = Index;
        this.interval = null;
        this.handleContainerView = this.handleContainerView.bind(this);
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
    handleContainerView(e) {    //右侧界面动态转换事件方法
        if ('undefined' === typeof e.target) {
            this.setState({e:e.element,param:e.param});
        } else {
            let dataset = e.target.dataset,
                element = dataset.e,
                option = dataset.option,
                param = dataset.param;
            if (
                'undefined' !== typeof element     //防止未注册组件崩溃
                && 
                this.state.e != element
            ) this.setState({e:element});
            if ('undefined' !== typeof option) this.setState({option:option});    //防止未注册菜单项
            if ('undefined' !== typeof param) this.setState({param:param});
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
                changeView={this.handleContainerView}
            />
        );
        let E = route[state.e];   //展示指定视图组件
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
                    {/* 视图组件 */}
                    <E 
                        token={token} 
                        param={state.param}
                        changeView={this.handleContainerView}
                        branch={branch}
                    />
            </div>
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
            opt = props.options,
            isShowOrders = 'order' == props.id && props.orders > 0,
            status = isUp ? 'main-spread' : 'main-shrink',    //判断当前大选项是否为选中状态
            optStatus = {display:isUp ? 'block' : 'none'},
            items = opt.map((obj) => 
                //创建多个选项
                <div key={obj.key}>
                    <nav  
                        data-option={obj.key} 
                        data-e={obj.key}
                        className={props.option == obj.key ? 'main-chosen' : null} 
                        onClick={props.changeView}
                    >
                        {obj.text}
                        {isShowOrders && '订单处理' == obj.text? <em className='main-tag'>{props.orders}</em> : ''}
                    </nav>
                </div>
            );
        return (
            <dl>
                <dt onClick={() => this.setState({isUp:!this.state.isUp})}>
                    <i id={props.id}>{props.text}</i>
                    <i className={'fa ' + (isUp ? 'fa-sort-asc' : 'fa-sort-desc')}></i>
                </dt>
                <dd className='main-option' style={optStatus}>{items}</dd>
            </dl>
        );
    }
}

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {currentData:[],previousData:[]};
    }

    render() {
        //首页右侧展示
        let list = [
            {sort:'收件',key:0,e:'take'},
            {sort:'入厂',key:1,e:'infactory'},
            {sort:'清洗',key:2,e:'offline_clean'},
            {sort:'烘干',key:3,e:'offline_drying'},
            {sort:'熨烫',key:4,e:'offline_ironing'},
            {sort:'质检',key:5,e:'offline_check'},
            {sort:'上挂',key:6,e:'registration'},
            {sort:'出厂',key:7,e:'outfactory'},
            {sort:'取衣',key:8,e:'offline_take'},
            {sort:'反流',key:9}
        ]
    	let html = list.map((obj)=>    		
    		<div onClick={this.props.changeView} data-e={obj.e} key={obj.key}>{obj.sort}</div>     		        		    
    	)
    	return (
    		<div >
	    		<div id='list-div'>
	    		   {html}
	    		</div>
	    		<div className='members'>               
		             <div order='11'>新建会员</div>
		             <div order='12'>会员充值</div>
	            </div>
	        </div>
    	)
   }
}

ReactDOM.render(<Main/>,document.getElementById('root'));