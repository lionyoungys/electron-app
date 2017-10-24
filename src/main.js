/**
 * 后台主界面组件 新手请注意，前方高能，请保重
 * @author yangyunlong
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import './static/api';
import {MyChart} from './static/UI';
import {FeedBack} from './main_layer';
import menus from './menus';
import Order from './order/order';
import Item from './order/item';
import Craft from './order/craft';
import Check from './order/check';
import Color from './order/color';
import Question from './order/question';
import Take from './offline/take';
import AddMember from './offline/add_member';
import Pay from './offline/pay';
import Info from './manage/info';
import InfoEditor from './manage/info_editor';
import Message from './manage/message';
import ClerkManage from './manage/clerk_manage'
import Finance from './manage/finance';
import Appraise from './manage/appraise';
import Award from './manage/award';
import Goods from './manage/goods';
import GoodsAdd from './manage/goods_add';
import Operate from './manage/operate';
import OrderSearch from './order/order_search';
import OrderDetail from './order/order_detail';
const token = localStorage.getItem('token');
//界面头部组件
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {feedbackShow:false};
        this.toggleFeedback = this.toggleFeedback.bind(this);
    }
    toggleFeedback() {
        this.setState({feedbackShow:!this.state.feedbackShow});
    }
    render() {
        let state = this.state;
        return (
            <div id='main-header'>
                <div id="main-hleft">速洗达商家管理系统</div>
                <div id="main-hright">
                    <span id="main-feedback" onClick={this.toggleFeedback}>意见反馈</span>
                    <span id="main-password">修改密码</span>
                    <input type="button" value="退出" id="main-logout"/>
                </div>
                <FeedBack show={state.feedbackShow} onCancelRequest={this.toggleFeedback}/>
            </div>
        );
    }
}
//界面主体容器组件
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:null,status:null,logo:null,orders:null,amount:null,count:null,    //数据状态
            option:null,  //菜单栏样式状态
            e:this.props.children,param:null    //右侧展示样式状态 附带参数
        };
        this.handleContainerView = this.handleContainerView.bind(this);
        //注册组件列表
        this.elements = {
            index:Index,    //首页
            order:Order,    //订单处理
            item:Item,    //添加项目
            craft:Craft,    //工艺加价
            check:Check,    //衣物检查
            color:Color,    //颜色设置
            question:Question,    //问题描述
            take:Take,    //线下收衣
            addMember:AddMember,    //散客信息
            pay:Pay,    //订单支付
            info:Info,    //门店信息
            info_editor:InfoEditor,    //信息编辑
            message:Message,    //消息通知
            clerk_manage:ClerkManage,    //员工管理
            finance:Finance,    //财务对账
            appraise:Appraise,    //用户评价
            award:Award,    //返现记录
            goods:Goods,    //商品管理
            goods_add:GoodsAdd,    //添加商品
            operate:Operate,    //经营分析
            order_search:OrderSearch,    //订单查询
            order_detail:OrderDetail,    //订单详情
        };
    }
    //获取店铺状态数据
    componentDidMount() {
        axios.post(api.U('index'),api.data({token:this.props.token}))
        .then((response)=>{
            let result = response.data.data;
            this.setState({
                name:result.mname,    //店铺名称
                status:result.state,    //店铺状态
                logo:'url(' +api.host+result.circle_logo+ ')',    //店铺头像
                orders:result.will_dispose,    //店铺待处理订单数
                amount:result.total,    //营业总额
                count:result.order_count    //有效订单
            });         
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
            menusList = menus.map((obj) =>     //创建多个菜单组件
            <Menu 
                key={obj.id} 
                id={obj.id} 
                orders={state.orders}
                selection={obj.selection} 
                options={obj.options} 
                option={state.option}
                changeView={this.handleContainerView}
            />
        );
        const E = this.elements[state.e],    //展示指定视图组件
              mainStyle = {
                  height:'100%',width:'100%',
                  display:'flex',display:'-webkit-flex',
                  justifyContent:'space-between'
              };
        return (
            <div style={mainStyle}>
                {/* 左侧菜单栏容器 */}
                <aside id='main-sidebar'>
                     {/* 信息展示组件 */}
                    <Base token={props.token} name={state.name} status={state.status} logo={state.logo}/>
                    {/* 导航容器组件及导航栏视图组件 */}
                    <div id='main-nav'>{menusList}</div>
                </aside>
                {/* 右侧视图容器 */}
                <div id='main-container'>
                    {/* 视图组件 */}
                    <E 
                        token={props.token} 
                        amount={state.amount} 
                        count={state.count} 
                        param={state.param}
                        changeView={this.handleContainerView}
                    />
                </div>
            </div>
        );
    }
}
//侧边栏信息状态视图组件
class Base extends Component {
    constructor(props) {
        super(props);
        this.state = {status:null};
        this.statusSwitchover = this.statusSwitchover.bind(this);
    }
    statusSwitchover() {
        //操作当前店铺状态时，获取当前店铺状态并取反
        let status = this.state.status,
            pstatus = this.props.status,
            state = null == status ? (1 == pstatus ? 3 : 1) : (1 == status ? 3 : 1);
        axios.post(api.U('statusSwitchover'),api.data({token:this.props.token,state:state}))
        .then((response) => {
            if (api.verify(response.data)) this.setState({status:state});
        });
    }
    render() {
        let props = this.props,
            status = this.state.status,
            isOpen = null == status ? (1 == props.status) : (1 == status),
            bg = isOpen ? 'main-open' : 'main-close',
            word = isOpen ? '营业中' : '暂停营业';
        return (
            <div id='main-base'>
                <div id="main-logo" style={{backgroundImage:props.logo}}></div>
                <div id="main-name">{props.name}</div>
                <div id="main-state" onClick={this.statusSwitchover} className={bg}>{word}</div>
            </div>
        );
    }
}
//菜单视图组件
class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {isSpread:false}
        this.chooseMenu = this.chooseMenu.bind(this);
    }
    chooseMenu(e) {this.setState({isSpread:!this.state.isSpread});}
    render() {
        let props = this.props,
            isSpread = this.state.isSpread,
            sel = props.selection,
            opt = props.options,
            isShowOrders = 'order' == sel.id && props.orders > 0,
            status = isSpread ? 'main-spread' : 'main-shrink',    //判断当前大选项是否为选中状态
            optStatus = {display:isSpread ? 'block' : 'none'},
            items = opt.map((obj) => 
                //创建多个选项
                <nav 
                    key={obj.id} 
                    data-option={obj.id} 
                    data-e={obj.e}
                    className={props.option == obj.id ? 'main-chosen' : null} 
                    onClick={this.props.changeView}
                >
                    {obj.text}
                    {isShowOrders && '订单处理' == obj.text? <em className='main-tag'>{props.orders}</em> : ''}
                </nav>
            );
        return (
            <dl>
                <dt onClick={this.chooseMenu} className='main-selection'>
                    <div id={sel.id}>{sel.text}</div>
                    <div className={status} onClick={this.chooseMenu}></div>
                </dt>
                <dd className='main-option' style={optStatus}>{items}</dd>
            </dl>
        );
    }
}
//首页右侧展示
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {currentData:[],previousData:[]};
    }

    componentDidMount() {
        axios.post(
            api.U('operate'),
            api.data({token:this.props.token})
        )
        .then((respones) => {
            let result = respones.data.data;
            this.setState({
                currentData:result.now_sum,
                previousData:result.previous_sum,
            });
            console.log(result);
        });
    }

    render() {
        let props = this.props,
            state = this.state,
            count = props.count,
            amount = props.amount,
            amountArr = String(amount).split('.'),    //拆分价格显示
            wordStyle = {marginTop:'40px',fontSize:'18px'};
        if ('undefined' == typeof amountArr[1]) amountArr[1] = '00'
        return (
            <div style={{padding: '30px 30px 0 30px'}}>
                <section className='ui-content'>
                    <MyChart current={state.currentData} previous={state.previousData}/>
                </section>
                <section className='main-word'>
                    今日营业总额：
                    <span className='main-word-larger'>{amountArr[0] + '.'}</span>
                    <span>{amountArr[1]}</span>
                </section>
                <section className='main-word'>
                    今日有效订单：<span className='main-word-larger'>{amount}</span>
                </section>
            </div>
        );
    }
}

ReactDOM.render(<Header/>,document.getElementsByTagName('header')[0]);
ReactDOM.render(<Main token={token}>index</Main>,document.getElementById('main'));
/* 样式原因，所有组件根节点都要使用div */