/**
 * 线上订单订单处理组件
 * @author yangyunlong
 */
import React from 'react';
import CancelToast from '../UI/cancel-toast/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.props.onRef(this);
        let param = this.props.param;
        this.state = {
            checked: ( ( tool.isSet(param) && tool.isSet(param.checked) ) ? param.checked : 'ordering' ),    //选项卡选中
            data:[],
            show:false,
            oid:null,
            showNotice:false,
            noticeMsg:'用户尚未付款，您暂时不能做此操作'
        };    //选项卡选择属性 当前数据 弹窗展示与否 当前订单
        this.handleClick = this.handleClick.bind(this);    //切换选项卡方法
        this.adapter = this.adapter.bind(this);    //数据适配处理方法
        this.btnAdapter = this.btnAdapter.bind(this);    //根据数据状态返回按钮操作
        this.showCancelLayer = this.showCancelLayer.bind(this);    //隐藏展示取消订单弹出层方法
        this.onCancelRequest = this.onCancelRequest.bind(this);    //订单取消方法
        this.onConfirmRequest = this.onConfirmRequest.bind(this);    //确认订单方法
        this.addItem = this.addItem.bind(this);    //跳转添加项目界面
        this.upload = this.upload.bind(this);    //跳转上传图片界面
        this.checkOff = this.checkOff.bind(this);    //检查完成方法
        this.isClean = this.isClean.bind(this);    //清洗完成方法
        this.isPost = this.isPost.bind(this);    //送件完成
        this.query = this.query.bind(this);
        //选项卡列表 api 对应接口地址
        this.tabs = [
            {value:'待处理',api:'ordering'},
            {value:'待收件',api:'to_take'},
            {value:'待清洗',api:'to_clean'},
            {value:'清洗中',api:'cleaning'},
            {value:'待送达',api:'posting'}
        ];
        //取消订单选项
        this.options = [
            {key:0,value:'商家暂不接单'},
            {key:1,value:'超出服务范围'},
            {key:2,value:'无法提供客户所选服务'},
            {key:3,value:'距离太远'}
        ];
        this.timerID = null;
    }
    componentDidMount() {
        this.query();
    }
    query() {
        axios.post(api.U(this.state.checked),api.D({token:this.props.token}))
        .then(response => {
            api.V(response.data) && this.setState({data:response.data.result});
            console.log(response.data);
        });
    }
    componentWillUnmount() {
        null !== this.timerID && clearTimeout(this.timerID);
    }
    handleClick(e) {
        let checked = e.target.dataset.api;
        axios.post(api.U(checked),api.D({token:this.props.token,page:1,limit:10000}))
        .then((response) => {
            api.V(response.data) && this.setState({data:response.data.result,checked:checked});
            console.log(response.data);
        });
    }
    getRowByItem(data, key) {
        return data.map((obj, index) => 
            <p key={index}>
                {'status' === key ? tool.itemStatus(obj[key]) : ('item_price' === key ? <span>&yen;{obj[key]}</span> : obj[key])}
            </p>
        );
    }

    adapter() {
        let adapter = {head:null,body:null},
            checked = this.state.checked;
        if ('ordering' == checked || 'to_take' == checked) {
            adapter.head = (
                <tr className='bd-lightgrey m-bg-white'>
                    <th>订单号</th>
                    <th>预约时间</th>
                    <th>姓名</th>
                    <th>电话</th>
                    <th>地址</th>
                    <th>时间</th>
                    <th>处理</th>
                </tr>
            );
            adapter.body = this.state.data.map(obj => 
                <tr className='bd-lightgrey' key={obj.id}>
                    <td>{obj.ordersn}</td>
                    <td className='m-red'>{obj.time}</td>
                    <td>{obj.uname}</td>
                    <td>{obj.umobile}</td>
                    <td>{obj.uaddress}</td>
                    <td>{obj.otime}</td>
                    {this.btnAdapter(obj.id)}
                </tr>
            );
        } else if ('to_clean' == checked || 'cleaning' == checked) {
            adapter.head = (
                <tr>
                    <th>订单号</th>
                    <th>衣物编码</th>
                    <th>名称</th>
                    <th>价格</th>
                    <th>衣物状态</th>
                    <th>工艺加价</th>
                    <th>合计</th>
                    <th>客户信息</th>
                    <th>操作</th>
                </tr>
            );

            adapter.body = this.state.data.map(obj =>
                <tr key={obj.id} className='online-tr'>
                    <td>{obj.ordersn}</td>
                    <td>{this.getRowByItem(obj.items, 'clean_sn')}</td>
                    <td>{this.getRowByItem(obj.items, 'item_name')}</td>
                    <td>{this.getRowByItem(obj.items, 'item_price')}</td>
                    <td>{this.getRowByItem(obj.items, 'status')}</td>
                    <td>
                        上门服务费：&yen;{obj.freight_price}<br/>
                        特殊工艺加价：&yen;{obj.craft_price}<br/>
                        保值清洗费：&yen;{obj.keep_price}<br/>
                        优惠金额：&yen;{obj.reduce_price}<br/>
                    </td>
                    <td>
                        {obj.items.length}件<br/>
                        &yen;{obj.amount}
                    </td>
                    <td>
                        姓名：{obj.uname}<br/>
                        电话：{obj.umobile}<br/>
                        地址：{obj.uaddress}<br/>
                    </td>
                    {this.btnAdapter(obj.id, obj.checked, obj)}
                </tr>
            );
        } else {
            adapter.head = (
                <tr className='bd-lightgrey m-bg-white'>
                    <th>订单号</th>
                    <th>项目</th>
                    <th>工艺加价</th>
                    <th>件数</th>
                    <th>总价</th>
                    <th>姓名</th>
                    <th>电话</th>
                    <th>地址</th>
                    <th>时间</th>
                    <th>操作</th>
                </tr>
            );
            adapter.body = this.state.data.map(obj => 
                <tr className='bd-lightgrey' key={obj.id}>
                    <td>{obj.ordersn}</td>
                    <td>{this.itemsToHtml(obj.items)}</td>
                    <td>
                        <div className='m-between-box online'><span>上门服务费</span><span>&yen;{obj.freight_price}</span></div>
                        <div className='m-between-box online'><span>特殊工艺加价</span><span>&yen;{obj.craft_price}</span></div>
                        <div className='m-between-box online'><span>保值清洗费</span><span>&yen;{obj.keep_price}</span></div>
                        <div className='m-between-box online'><span>优惠金额</span><span>&yen;{obj.reduce_price}</span></div>
                    </td>
                    <td>{obj.items.length}件</td>
                    <td className='m-red'>&yen;{obj.pay_amount}</td>
                    <td>{obj.uname}</td>
                    <td>{obj.umobile}</td>
                    <td>{obj.uaddress}</td>
                    <td>{obj.otime}</td>
                    {this.btnAdapter(obj.id, obj.checked)}
                </tr>
            );
        }
        return adapter;
    }

    btnAdapter(id, checked, obj) {
        switch (this.state.checked)
        {
            case 'ordering':
                return (
                    <td>
                        <p><button type='button' className='m-btn m-btn-cancel' data-id={id} onClick={this.showCancelLayer}>取消订单</button></p>
                        <p><button type='button' className='m-btn m-btn-confirm' data-id={id} onClick={this.onConfirmRequest}>确认订单</button></p>
                    </td>
                );
            case 'to_take':
                return (
                    <td>
                        <p><button type='button' className='m-btn m-btn-cancel' data-id={id} onClick={this.showCancelLayer}>取消订单</button></p>
                        <p><button type='button' data-id={id} className='m-btn m-btn-confirm' onClick={this.addItem}>添加项目</button></p>
                    </td>
                );
            case 'to_clean':
                return (
                    <td>
                        <div>{1 == obj.pay_state ? '已' : '待'}支付</div>
                        <div><button type='button' className='e-btn confirm' data-id={id} onClick={this.upload}>上传照片</button></div>
                        <div><button 
                            type='button'
                            className={`e-btn ${checked ? 'confirm' : 'cancel'}`}
                            data-id={id}
                            onClick={this.checkOff}
                        >检查完成</button></div>
                    </td>
                );
            case 'cleaning':
                return (
                    <td>
                        <div>{obj.all_put ? '已全部上挂' : '未上挂'}</div>
                        <div>
                            {
                                obj.all_put ?
                                <button type='button' className='e-btn confirm' data-id={id} onClick={this.isClean}>清洗完成</button>
                                :
                                <button type='button' className='e-btn cancel'>清洗完成</button>
                            }
                        </div>
                    </td>
                );
            case 'posting':
                return (<td><button type='button' className='m-btn m-btn-confirm' data-id={id} onClick={this.isPost}>送件完成</button></td>);
        }
    }
    showCancelLayer(e) {this.setState({show:true,oid:e.target.dataset.id})}
    onCancelRequest(data) {
        this.setState({show:false})
        axios.post(api.U('cancel'),api.D({token:this.props.token,oid:this.state.oid,cause:data.toString()}))
        .then((response) => {
            if (api.V(response.data)) {
                let index = this.state.oid.inObjectArray(this.state.data,'id');
                if (-1 !== index) {
                    this.state.data.splice(index,1);
                    this.setState({data:this.state.data});
                }
            }
        });
    }
    onConfirmRequest(e) {
        let id = e.target.dataset.id;
        axios.post(api.U('confirm'),api.D({token:this.props.token,oid:id}))
        .then((response) => {
            if (api.V(response.data)) {
                let index = id.inObjectArray(this.state.data, 'id');
                if (-1 !== index) {
                    this.state.data.splice(index, 1);
                    this.setState({data:this.state.data});
                }
            }
        });
    }
    addItem(e) {this.props.changeView({view:'online_add_item',param:e.target.dataset.id})}
    upload(e) {this.props.changeView({view:'upload',param:{oid:e.target.dataset.id}})}
    checkOff(e) {
        let id = e.target.dataset.id;
        axios.post(api.U('checkoff'), api.D({token:this.props.token,oid:id}))
        .then(response => {
            if (api.V(response.data)) {
                let index = id.inObjectArray(this.state.data,'id');
                if (-1 !== index) {
                    this.state.data.splice(index, 1);
                    this.setState({data:this.state.data});
                }
            } else {
                alert(response.data.msg);
            }
        });
    }
    isClean(e) {
        let id = e.target.dataset.id;
        axios.post(api.U('is_clean'), api.D({token:this.props.token,oid:id}))
        .then(response => {
            if (api.V(response.data)) {
                let index = id.inObjectArray(this.state.data,'id');
                if (-1 !== index) {
                    this.state.data.splice(index, 1);
                    this.setState({data:this.state.data});
                }
            }
            console.log(response.data);
        });
    }
    isPost(e) {
        let id = e.target.dataset.id;
        axios.post(api.U('is_post'), api.D({token:this.props.token,oid:id}))
        .then(response => {
            if (api.V(response.data)) {
                let index = id.inObjectArray(this.state.data,'id');
                if (-1 !== index) {
                    this.state.data.splice(index, 1);
                    this.setState({data:this.state.data});
                }
            }
            console.log(response.data);
        });
    }
    itemsToHtml(items) {
        return items.map((obj, index) => 
            <div key={index} className='m-between-box online'>
                <span>{obj.item_name}</span>
                <span>&yen;{obj.item_price}</span>
            </div>
        );
    }

    render() {
        let adapter = this.adapter();
        let tabs = this.tabs.map(obj => 
            <span
                key={obj.api}
                data-api={obj.api}
                className={'m-tab' + (this.state.checked == obj.api ? ' checked': '')}
                onClick={this.handleClick}
            >{obj.value}</span>
        );
        return (
            <div>
                <div className='m-container'>
                    <div>{tabs}</div>
                    <div className='m-box'>
                        <table className='e-table border'>
                            <thead>{adapter.head}</thead>
                            <tbody>{adapter.body}</tbody>
                        </table>
                    </div>
                </div>
                <CancelToast 
                    show={this.state.show} 
                    data={this.options} 
                    onCloseRequest={() => this.setState({show:false})} 
                    title='取消订单原因' 
                    btnValue='取消订单'
                    onConfirmRequest={this.onCancelRequest}
                />
            </div>
        );
    }
}