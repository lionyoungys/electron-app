/**
 * 订单处理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs, {Tabs,Search,CheckboxAlert,Notification} from '../static/UI';

class Order extends Component {
    constructor(props) {
        super(props);
        this.params = (
            'undefined' === typeof this.props.param 
            || 
            null == this.props.param
        ) ? {} : this.props.param.paramToObject();    //参数列表
        this.state = {
            choose:'undefined' !== typeof this.params.choose ? this.params.choose : 0,
            data:[],html:null,show:false,currentOrder:null,
            showNotice:false,noticeMsg:'用户尚未付款，您暂时不能做此操作'
        };    //选项卡选择属性 当前数据 展示html 弹窗展示与否 当前订单
        this.handleClick = this.handleClick.bind(this);    //切换选项卡方法
        this.willDispose = this.willDispose.bind(this);    //待处理
        this.willTake = this.willTake.bind(this);    //待收件
        this.willClean = this.willClean.bind(this);    //待清洗
        this.cleaning = this.cleaning.bind(this);    //清洗中
        this.willDelivery = this.willDelivery.bind(this);    //待送达
        this.generateItemsList = this.generateItemsList.bind(this);    //项目列表生成器
        this.orderConfirm = this.orderConfirm.bind(this);    //确认订单方法
        this.checkDone = this.checkDone.bind(this);    //检查完成方法
        this.cleanDone = this.cleanDone.bind(this);    //清洗完成方法
        this.done = this.done.bind(this);    //送件完成方法
        this.onClose = this.onClose.bind(this);    //弹窗关闭方法
        this.openAlert = this.openAlert.bind(this);    //打开弹窗方法
        this.onConfirm = this.onConfirm.bind(this);    //弹窗确认回调方法
        //选项卡参数
        this.tabs = [
            {key:0,text:'待处理'},
            {key:1,text:'待收件'},
            {key:2,text:'待清洗'},
            {key:3,text:'清洗中'},
            {key:4,text:'待送达'}
        ];
        //多选框参数
        this.checkboxs = [
            {text:'商家暂不接单',key:0},
            {text:'超出服务范围',key:1},
            {text:'无法提供客户所选服务',key:2},
            {text:'距离太远',key:3},
            {text:'其他原因',key:4},
        ];
        //表格头部模型
        this.theadsModel = [
            <tr className='ui-tr-h'>
                <td>订单号</td>
                <td>预约上门时间</td>
                <td>姓名</td>
                <td>电话</td>
                <td>地址</td>
                <td>时间</td>
                <td>处理</td>
            </tr>,
            <tr className='ui-tr-h'>
                <td>订单号</td>
                <td>项目</td>
                <td>工艺加价</td>
                <td>件数</td>
                <td>总价</td>
                <td>姓名／电话</td>
                <td>地址</td>
                <td>时间</td>
                <td>操作</td>
            </tr>
        ];
        //表格头部内容
        this.theads = [
            this.theadsModel[0],
            this.theadsModel[0],
            this.theadsModel[1],
            this.theadsModel[1],
            this.theadsModel[1]
        ];
        //订单进程列表对应状态
        this.process = [this.willDispose,this.willTake,this.willClean,this.cleaning,this.willDelivery];
        this.timerID = null;
    }
    componentDidMount() {
        axios.post(api.U('orderHandle'),api.data({token:this.props.token,state:this.state.choose}))
        .then((response) => {
            let result = response.data,
                html = this.process[this.state.choose](result.data);
            this.setState({data:result.data,html:html});
        });
    }
    componentWillUnmount() {
        if (null !== this.timerID) {
            clearTimeout(this.timerID);
        }
    }
    handleClick(e) {
        let state = e.target.dataset.key;
        axios.post(api.U('orderHandle'),api.data({token:this.props.token,state:state}))
        .then((response) => {
            let result = response.data,
                html = this.process[state](result.data);
            this.setState({choose:state,data:result.data,html:html});
        });
    }
    handleSearch(word) {
        console.log(word);
    }
    //待处理
    willDispose(data) {
        let items = data.map((obj) => 
            <tr key={obj.id} className='ui-tr-d'>
                <td>{obj.ordersn}</td>
                <td className='ui-red'>{obj.time}</td>
                <td>{obj.name}</td>
                <td>{obj.phone}</td>
                <td>{obj.adr}</td>
                <td>{obj.create_time}</td>
                <td>
                    <div className='ui-box-between'>
                        <input type='button' data-id={obj.id} type='button' value='取消订单' className='ui-btn ui-btn-cancel' onClick={this.openAlert}/>
                        <input type='button' data-id={obj.id} type='button' value='确认订单' className='ui-btn ui-btn-confirm' onClick={this.orderConfirm}/>
                    </div> 
                </td>
            </tr>
        );
        return items;
    }
    //待收件
    willTake(data) {
        let items = data.map((obj) => 
            <tr key={obj.id} className='ui-tr-d'>
                <td>{obj.ordersn}</td>
                <td className='ui-red'>{obj.time}</td>
                <td>{obj.name}</td>
                <td>{obj.phone}</td>
                <td>{obj.adr}</td>
                <td>{obj.create_time}</td>
                <td>
                    <div className='ui-box-between'>
                        <input data-id={obj.id} type='button' value='取消订单' className='ui-btn ui-btn-cancel' onClick={this.openAlert}/>
                        <input data-param={'id=' + obj.id} data-e='item' type='button' value='添加项目' className='ui-btn ui-btn-confirm' onClick={this.props.changeView}/>
                    </div> 
                </td>
            </tr>
        );
        return items;
    }
    //待清洗
    willClean(data) {
        let items = data.map((obj) => 
            <tr key={obj.id} className='ui-tr-d'>
                <td>{obj.ordersn}</td>
                <td>{this.generateItemsList(obj.item)}</td>
                <td>
                    <div className='ui-box-between'><span>上门服务费</span><span>&yen;{obj.freight}</span></div>
                    <div className='ui-box-between'><span>特殊工艺加价</span><span>&yen;{obj.special}</span></div>
                    <div className='ui-box-between'><span>保值洗</span><span>&yen;{obj.hedging}</span></div>
                    <div className='ui-box-between'><span>优惠金额</span><span>&yen;{obj.coupon_price}</span></div>
                </td>
                <td>{obj.sum}件</td>
                <td className='ui-red'>{obj.amount}</td>
                <td>{obj.name}<br/>{obj.phone}</td>
                <td>{obj.adr}</td>
                <td>{obj.update_time}</td>
                <td>
                    <div className='ui-box-column'>
                        <input type='button' data-e='check' data-param={'id=' + obj.id} value='衣物检查' className='ui-btn ui-btn-confirm' onClick={this.props.changeView}/>
                        <div style={{height:'10px'}}></div>
                        <input 
                            type='button' 
                            data-id={obj.id} 
                            value='检查完成' 
                            className={'ui-btn ' + (1==obj.pay_state ? 'ui-btn-confirm' : 'ui-btn-grey')}
                            onClick={this.checkDone}
                        />
                    </div>
                </td>
            </tr>
        );
        return items;
    }
    //清洗中
    cleaning(data) {
        let items = data.map((obj) => 
            <tr key={obj.id} className='ui-tr-d'>
                <td>{obj.ordersn}</td>
                <td>{this.generateItemsList(obj.item)}</td>
                <td>
                    <div className='ui-box-between'><span>上门服务费</span><span>&yen;{obj.freight}</span></div>
                    <div className='ui-box-between'><span>特殊工艺加价</span><span>&yen;{obj.special}</span></div>
                    <div className='ui-box-between'><span>保值洗</span><span>&yen;{obj.hedging}</span></div>
                    <div className='ui-box-between'><span>优惠金额</span><span>&yen;{obj.coupon_price}</span></div>
                </td>
                <td>{obj.sum}件</td>
                <td className='ui-red'>{obj.amount}</td>
                <td>{obj.name}<br/>{obj.phone}</td>
                <td>{obj.adr}</td>
                <td>{obj.update_time}</td>
                <td><input type='button' data-id={obj.id} value='清洗完成' className='ui-btn ui-btn-confirm' onClick={this.cleanDone}/></td>
            </tr>
        );
        return items;
    }
    //待送达
    willDelivery(data) {
        let items = data.map((obj) => 
            <tr key={obj.id} className='ui-tr-d'>
                <td>{obj.ordersn}</td>
                <td>{this.generateItemsList(obj.item)}</td>
                <td>
                    <div className='ui-box-between'><span>上门服务费</span><span>&yen;{obj.freight}</span></div>
                    <div className='ui-box-between'><span>特殊工艺加价</span><span>&yen;{obj.special}</span></div>
                    <div className='ui-box-between'><span>保值洗</span><span>&yen;{obj.hedging}</span></div>
                    <div className='ui-box-between'><span>优惠金额</span><span>&yen;{obj.coupon_price}</span></div>
                </td>
                <td>{obj.sum}件</td>
                <td className='ui-red'>{obj.amount}</td>
                <td>{obj.name}<br/>{obj.phone}</td>
                <td>{obj.adr}</td>
                <td>{obj.update_time}</td>
                <td><input type='button' data-id={obj.id} value='送件完成' className='ui-btn ui-btn-confirm' onClick={this.done}/></td>
            </tr>
        );
        return items;
    }
    //确认订单方法
    orderConfirm(e) {
        let state = this.state,
            id = e.target.dataset.id;
        axios.post(
            api.U('orderHandle'), 
            api.data({token:this.props.token,id:id,state:state.choose})
        )
        .then((response) => {
            if (api.verify(response.data)) {
                let index = id.inObjectArray(state.data,'id');
                if (-1 !== index) {
                    state.data.splice(index,1);
                    let html = this.process[state.choose](state.data);
                    this.setState({html:html});
                }
            }
        });
    }
    //清洗完成
    cleanDone(e) {
        let state = this.state,
            id = e.target.dataset.id;
        axios.post(api.U('cleanDone'),api.data({token:this.props.token,id:id}))
        .then((response) => {
            let result = response.data;
            if (api.verify(result)) {
                let index = id.inObjectArray(state.data,'id');
                if (-1 !== index) {
                    state.data.splice(index,1);
                    let html = this.process[state.choose](state.data);
                    this.setState({html:html});
                }
            } else {

            }
        });
    }
    //检查完成
    checkDone(e) {
        let target = e.target,
            id = target.dataset.id,
            state = this.state;
        if (target.classList.contains('ui-btn-confirm')) {
            axios.post(api.U('checkDone'),api.data({token:this.props.token,orderid:id}))
            .then((response) => {
                let result = response.data;
                console.log(response.data);
                if (api.verify(result)) {
                    let index = id.inObjectArray(state.data,'id');
                    if (-1 !== index) {
                        state.data.splice(index,1);
                        let html = this.process[state.choose](state.data);
                        this.setState({html:html});
                    }
                } else {
                    this.setState({showNotice:true,noticeMsg:result.status});
                    this.timerID = setTimeout(()=>{
                        if ('undefined' !== state.showNotice && null !== state.showNotice) {
                            this.setState({showNotice:false});
                        }
                    },3000);
                }
            });
        } else {
            this.setState({showNotice:true,noticeMsg:'用户尚未付款，您暂时不能做此操作'});
            this.timerID = setTimeout(()=>{
                if ('undefined' !== state.showNotice && null !== state.showNotice) {
                    this.setState({showNotice:false});
                }
            },3000);
        }
    }
    //送件完成
    done(e) {
        let state = this.state,
            id = e.target.dataset.id;
        axios.post(api.U('done'),api.data({token:this.props.token,id:id}))
        .then((response) => {
            if (api.verify(response.data)) {
                let index = id.inObjectArray(state.data,'id');
                if (-1 !== index) {
                    state.data.splice(index,1);
                    let html = this.process[state.choose](state.data);
                    this.setState({html:html});
                }
            }
        });
    }
    //关闭弹框方法
    onClose() {
        if (this.state.show) this.setState({show:false}); 
    }
    //弹窗确认方法
    onConfirm(checkedList) {
        if (checkedList.length < 1) return;
        this.setState({show:false})
        let state = this.state;
        axios.post(
            api.U('orderCancel'),
            api.data({token:this.props.token,id:state.currentOrder,quxiao:checkedList.toString()})
        )
        .then((response) => {
            if (api.verify(response.data)) {
                let index = state.currentOrder.inObjectArray(state.data,'id');
                if (-1 !== index) {
                    state.data.splice(index,1);
                    let html = this.process[state.choose](state.data);
                    this.setState({html:html});
                }
            }
        });
    }
    //打开弹窗方法
    openAlert(e) {
        this.setState({currentOrder:e.target.dataset.id});
        if (!this.state.show) this.setState({show:true});
    }


    generateItemsList(items) {
        return items.map((obj) => 
            <div key={obj.id} className='ui-box-between'>
                <span>{obj.g_name}</span>
                <span>{obj.number}</span>
                <span>&yen;{obj.price}</span>
            </div>
        );
    }

    render() {
        let state = this.state;
        return (
            <div>
                <Crumbs crumbs={[{text:'订单处理',key:1}]} callback={this.props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-box-between'>
                        <Tabs tabs={this.tabs} choose={state.choose} callback={this.handleClick}/>
                        <Search placeholder='请输入订单号' callback={this.handleSearch}/>
                    </div>
                    <div className='ui-content'>
                        <table className='ui-table ui-table-b'>
                            <thead>{this.theads[state.choose]}</thead>
                            <tbody>{state.html}</tbody>
                        </table>
                    </div>
                </section>
                <CheckboxAlert 
                    show={state.show} 
                    checkboxs={this.checkboxs} 
                    onClose={this.onClose} 
                    title='取消订单原因' 
                    button='取消订单'
                    callback={this.onConfirm}
                />
                <Notification show={state.showNotice} width='320'>
                    {state.noticeMsg}
                </Notification>
            </div>
        );
    }
}
export default Order;