/**
 * UI组件库
 * @author yangyunlong
 */
import React, {Component} from 'react';
import Highcharts from 'highcharts';
import Lightbox from 'react-image-lightbox';
import './UI.css';
import './func';
//面包屑导航栏 crumbs = [{key:索引key,e:跳转的视图组件,text:文字显示}] [index=首页跳转] [callback=回调操作]
export default class Crumbs extends Component {
    constructor(props) {super(props);}
    render() {
        let props = this.props,
            index = 'undefined' === typeof props.index ? 'index' : props.index,
            items = props.crumbs.map((obj) => 
                <div key={obj.key}>
                    <em>&gt;</em>
                    <span data-e={obj.e} data-param={obj.param} onClick={props.callback}>{obj.text}</span>
                </div>
            );
        return (
            <nav id="crumbs">
                位置&nbsp;:
                <span data-e={index} onClick={props.callback}>首页</span>{items}
            </nav>
        );
    }
}
//选项卡 tabs=[{key:key,text:文字显示}] choose=选中的key  [callback=回调操作]
export class Tabs extends Component {
    constructor(props) {super(props);}
    render() {
        let props = this.props,
            tabs = this.props.tabs;
        if ('undefined' === typeof tabs || tabs.length < 1) return null;
        let items = tabs.map((obj) => 
                    <div key={obj.key}
                         data-key={obj.key}
                         className={props.choose==obj.key?'ui-tab ui-tab-chosen':'ui-tab'}
                         onClick={props.callback}
                    >
                        {obj.text}
                    </div>
                );
        return(<div>{items}</div>);
    }
}
//searchbar placeholder  [callback=回调操作]
export class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {word:''};
    }

    render() {
        let props = this.props,
            state = this.state;
        return (
            <div className='ui-search'>
                <input 
                    type='text' 
                    placeholder={props.placeholder} 
                    value={state.word}
                    onChange={e => this.setState({word:e.target.value})}
                />
                <input type='button' value='搜索' onClick={() => props.callback(state.word)}/>
            </div>
        );
    }
}
//searchbar  button   placeholder  [callback=回调操作]
export class Search2 extends Component {
    constructor(props) {
        super(props);
        this.state = {word:''};
    }

    render() {
        let props = this.props,
            state = this.state;
        return (
            <div className='ui-search2'>
                <input 
                    type='text' 
                    placeholder={props.placeholder} 
                    value={state.word}
                    onChange={e => this.setState({word:e.target.value})}
                />
                <input 
                    type='button' 
                    value={props.button}
                    onClick={() => props.callback(state.word)}
                />
            </div>
        );
    }
}
//提示框 宽180px 高30px param:text=提示信息    
export class Notice extends Component {
    constructor(props) {super(props);}
    render() {
        let props = this.props,
            top = 'undefined' === typeof props.top ? 'calc((100% - 30px) / 2)' : props.top,
            style = {
                color:'rgb(255,255,255)',background:'black',borderRadius:'3px',fontSize:'16px',
                height:'30px',lineHeight:'30px',width:'180px',textAlign:'center',
                display:props.display ? 'inline-block' : 'none',overflow:'hidden',
                position:'fixed',left:'calc((100% - 180px) / 2)',top:top
            };
            if ('boolean' === typeof props.show && !props.show) return null;
        return (<div style={style}>{props.text}</div>);
    }
}
//相对定位提示框    show=true/false width=宽度
export class Notification extends Component {
    constructor(props) {super(props);}
    render() {
        let props = this.props,
            style = {
                width:props.width + 'px', 
                position:'fixed',
                top:'calc((100% - 30px) / 2)',
                left:'calc((100% - ' + props.width + 'px) / 2)',
                zIndex:'9999'
            };
        if (!props.show) return null;
        return (<div className='ui-notification' style={style}>{props.children}</div>);
    }
} 
//多选弹出框    show=true/false title=标题 button=按钮内容 是否展示 checkboxs=[{text:text,key:key}]
export class CheckboxAlert extends Component {
    constructor(props) {
        super(props);
        this.checkedList = [];
        this.checkedList2 = [];
        this.onClose = this.onClose.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    onClose() {
        this.checkedList = [];
        this.checkedList2 = [];
        this.props.onClose();
    }
    onConfirm() {
        if (func.isSet(this.props.detail)) {
            this.props.callback(this.checkedList2);
        } else {
            this.props.callback(this.checkedList);
        }
        this.checkedList = [];
        this.checkedList2 = [];
    }
    handleClick(e) {
        let node = e.target,
            text = e.target.innerText;
        if (node.classList.contains('ui-checked')) {    //判断是否选中状态
            let index = text.inArray(this.checkedList),
                index2 = text.inObjectArray(this.checkedList2,'text');
            this.checkedList.splice(index,1);    //清除选中
            this.checkedList2.splice(index2,1);
        } else {
            this.checkedList.push(text);    //添加选中
            this.checkedList2.push({key:node.dataset.id,text:text});
        }
        node.classList.toggle('ui-checked');
    }
    render() {
        let props = this.props,
            state = this.state;
        if (!props.show) return null;
        let items = props.checkboxs.map((obj) => 
            <div className='ui-alert-line' key={obj.key}>
                <span 
                    className={-1 !== obj.text.inArray(this.checkedList) ? 'ui-checkbox ui-checked' : 'ui-checkbox'} 
                    onClick={this.handleClick}
                    data-id={obj.key}
                >{obj.text}</span>
            </div>
        );
        return (
            <section className='ui-alert-bg'>
                <div className='ui-alert-checkbox'>
                    <div className='ui-alert-title'>
                        {props.title}<em className='right ui-close' onClick={this.onClose}></em>
                    </div>
                    {items}
                    <div className='ui-botton-area'>
                        <input 
                            type='button' 
                            value={props.button} 
                            onClick={this.onConfirm} 
                            className='ui-btn ui-btn-large ui-btn-confirm' 
                        />
                    </div>
                </div>
            </section>
        );
    }
}
//数学加减容器组件 innerText callback(true/false=+/-)
export class Math extends Component {
    constructor(props) {
        super(props);
        this.onAdd = this.onAdd.bind(this);
        this.onSubtract = this.onSubtract.bind(this);
    }
    onAdd() {this.props.callback(true);}
    onSubtract(e) {this.props.callback(false);}
    render() {
        return (
            <div className='ui-math-container'>
                <em className='ui-subtract' onClick={this.onSubtract}></em>
                <span className='ui-number'>{this.props.children}</span>
                <em className='ui-add' onClick={this.onAdd}></em>
            </div>
        );
    }
}
//工艺加价编辑价格弹窗  show=true/false callback(true/false=取消，确认,object=参数对象)
export class Special extends Component {
    constructor(props) {
        super(props);
        this.state = {special:'',hedging:'',comment:'',commentWordLength:0};
        this.cancel = this.cancel.bind(this);    //点击取消方法
        this.confirm = this.confirm.bind(this);    //点击确认方法
        this.specialChange = this.specialChange.bind(this);
        this.hedgingChange = this.hedgingChange.bind(this);
        this.commentChange = this.commentChange.bind(this);
    }
    specialChange(e) {
        if (isNaN(e.target.value)) return;
        this.setState({special:e.target.value});
    }
    hedgingChange(e) {
        if (isNaN(e.target.value)) return;
        this.setState({hedging:e.target.value});
    }
    commentChange(e) {
        let value = e.target.value;
        this.setState({comment:value,commentWordLength:value.length});
    }
    cancel() {
        this.props.callback(false);
        this.setState({special:'',hedging:'',comment:'',commentWordLength:0});
    }
    confirm() {
        let state = this.state;
        this.props.callback(true,{special:state.special,hedging:state.hedging,comment:state.comment});
        this.setState({special:'',hedging:'',comment:'',commentWordLength:0});
    }
    render() {
        let props = this.props,
            state = this.state;
        if (!props.show) return null;
        return (
            <section className='ui-alert-bg'>
                <div className='ui-special'>
                    <div className='ui-special-row'>
                        <label htmlFor='special'>特殊工艺加价：</label>
                        <div className='ui-special-input-area'>
                            <input type='text' id='special' onChange={this.specialChange} value={state.special}/>元
                        </div>
                    </div>
                    <div className='ui-special-row'>
                        <label htmlFor='hedging'>&emsp;&emsp;保值金额：</label>
                        <div className='ui-special-input-area'>
                            <input type='text' id='hedging' onChange={this.hedgingChange} value={state.hedging}/>元
                        </div>
                    </div>
                    <div className='ui-special-row'>
                        <label htmlFor='comment'>&emsp;&emsp;&emsp;&emsp;备注：</label>
                        <div className='ui-special-text-area'>
                            <textarea maxLength='40' id='comment' onChange={this.commentChange} value={state.comment}></textarea>
                            <div className='ui-textarea-postfix'>{state.commentWordLength}/40</div>
                        </div>
                    </div>
                    <div className='ui-special-btn-row'>
                        <input type='button' value='取消' className='ui-btn ui-btn-cancel ui-btn-large' onClick={this.cancel}/>
                        <input type='button' value='确认' className='ui-btn ui-btn-confirm ui-btn-large' onClick={this.confirm}/>
                    </div>
                </div>
            </section>
        );
    }
}

//问题描述及颜色设置输入内容栏
export class QCtextarea extends Component {
    constructor(props) {
        super(props);
        this.state = {value:'',len:0};
    }

    componentDidMount() {
        let props = this.props;
        console.log(props);
        if (func.isSet(props.value)) {
            this.setState({value:props.value,len:props.value.length});
        }
    }

    render() {
        return (
            <section style={{width:'100%',height:'144px'}}>
                <div style={{position:'relative',textAlign:'center',height:'63px',lineHeight:'63px',color:'#f92828',fontSize:'18px'}}>
                    {this.props.title}
                    <input 
                        type='button' 
                        value='确定' 
                        className='ui-btn-tab' 
                        style={{position:'absolute',right:'0',top:'5px'}}
                        onClick={() => this.props.callback(this.state.value)}
                    />
                </div>
                <div style={{position:'relative',width:'100%'}}>
                    <textarea 
                        maxLength='50'
                        className='ui-question-textarea'
                        placeholder={this.props.placeholder}
                        value={this.state.value}
                        onChange={e => {this.setState({value:e.target.value,len:e.target.value.length})}}
                    ></textarea>
                    <em className='ui-textarea-postfix'>{this.state.len}/50</em>
                </div>
            </section>
        );
    }
}

//问题描述及颜色设置菜单栏    header 大分类    options 选项列表及小分类    chosenArr 已选择的列表数组    callback 选中／取消切换
export class QCmenu extends Component {
    constructor(props) {
        super(props);
        this.state = {isSpread:false};
        this.toggleState = this.toggleState.bind(this);    //切换展示样式
        this.toggleChecked = this.toggleChecked.bind(this);    //取消／选中操作        
    }
    toggleState() {this.setState({isSpread:!this.state.isSpread});}
    toggleChecked(e) {
        let target = e.target;
        if (target.classList.contains('ui-checked')) {
            this.props.callback(false,target.innerText);
        } else {
            this.props.callback(true,target.innerText);
        }
        target.classList.toggle('ui-checked');
    }
    render() {
        let props = this.props,
            state = this.state,
            icon = state.isSpread ? 'ui-question-spread' : 'ui-question-shrink',
            display = {display:state.isSpread ? 'block' : 'none'},
            html = props.options.map((obj,index) => 
                <div key={index}>
                    {'' == obj.title ? null : <div className='ui-question-item-title'>{obj.title}</div>}
                    <div className='ui-question-item-container'>
                        {obj.list.map((item) =>
                            <div 
                                className={'ui-checkbox ui-question-item' + (-1 != item.inArray(props.chosenArr) ? ' ui-checked' : '')} 
                                key={item} 
                                onClick={this.toggleChecked}
                            >
                                {item}
                            </div>
                        )}
                    </div>
                </div>
            );
        return (
            <div className='ui-question-container'>
                <div className='ui-question-title'>
                    <span>{props.header}</span>
                    <em className={icon} onClick={this.toggleState}></em>
                </div>
                <div style={display}>{html}</div>
            </div>
        );
    }
}

//星星列表    number=星星数量 lighter=亮星星数量
export class Starts extends Component {
    constructor(props) {super(props);}

    render() {
        let props = this.props,
            number = func.isSet(props.number) && props.number > 0 ? (props.number * 1) : 5;
        var starts = [],
            lighter = func.isSet(props.lighter) ? (props.lighter * 1) : 5,
            tempWidth = '100%';
        for (var i = 0;i < number;++i) {
            if (lighter < 1) tempWidth = lighter.toPercent(); 
            starts.push(
                <div className='ui-start-background' key={i}>
                    <div className='ui-start'></div>
                    <div className='ui-start-forecolor' style={{width:tempWidth}}></div>
                </div>
            );
            if (lighter > 0) {
                lighter = lighter < 1 ? 0 : func.difference(lighter, 1);
            }
        }
        return (<section className='ui-starts-box'>{starts}</section>);
    }
}

//折线图组件    current = 当前月的数组记录    previous = 上月的数组记录
export class MyChart extends Component{
    constructor(props) {
        super(props);
        this.data = this.data.bind(this);
    }

    data(container) {
        if (null === container) return;
        let props = this.props,
            current = props.current.toNumberArray(),
            previous = props.previous.toNumberArray();
            
        Highcharts.chart(container, {
                title: {text: ''},
                yAxis: {title: {text: ''}},
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                        pointStart: 1
                    }
                },
            
                series: [{
                    name: '本月',
                    color: '#0bb1a7',
                    data: current
                }, {
                    name: '上月',
                    color: '#eb6304',
                    data: previous
                }],
            
                responsive: {
                    rules: [{
                        condition: {maxWidth: 600},
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            
            });
    }

    render() {return (<section ref={container => this.data(container)}></section>);}
}

//分页组件    count=总页数 current=当前页 callback(page)=回调函数 参数为选中页码
export class Page extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        let page = e.target.dataset.page;
        if (this.props.current != page) {
            this.props.callback(page);
        }
    }

    render() {
        let count = Number(this.props.count),
            current = Number(this.props.current),
            showCount = 10;    //展示总数

        if (count < 2) return null;
        let pages = [],
            start = 1,
            next = null,
            end = null;
        if (count > 10) {
            let difference = (count - current);
            if (current > 6) {
                pages.push(
                    <span 
                        className='ui-page-item' 
                        data-page='1' 
                        onClick={this.handleClick}
                        key='index'
                    >首页</span>
                );
                start = (current - 5);    //计算第一页
                if (difference < 4) start -= (4 - difference);
            }
            if (1 != current) {
                pages.push(
                    <span 
                        className='ui-page-item' 
                        data-page={(current - 1)} 
                        onClick={this.handleClick}
                        key='previous'
                    >上一页</span>
                );
            }
            if (count != current) {
                next = (
                    <span 
                        className='ui-page-item'
                        data-page={(current + 1)} 
                        onClick={this.handleClick}
                        key='next'
                    >下一页</span>
                );
            }
            if (difference > 4) {
                end = (
                    <span 
                        className='ui-page-item' 
                        data-page={count} 
                        onClick={this.handleClick}
                        key='end'
                    >尾页</span>
                );
            }
        }
        while(start <= count) {
            pages.push(
                <span 
                    className={start == current ? 'ui-page-chosen' : 'ui-page-item'}
                    data-page={start}
                    onClick={this.handleClick}
                    key={start}
                >{start}</span>
            );
            ++start;--showCount;
            if (0 === showCount) break; 
        }
        if (null !== next) pages.push(next);
        if (null !== end) pages.push(end);
        return (
            <section className='ui-page-box'>{pages}</section>
        );
    }
}

export class LightboxImage extends Component {
    constructor(props) {
        super(props);
        this.state = {isOpen:false};
    }

    render() {
        let props = this.props,
            isOpen = this.state.isOpen;
        if (isOpen) {
            return (
                <Lightbox 
                    onCloseRequest={() => this.setState({isOpen:false})}
                    mainSrc={props.src}
                />
            );
        }
        return (
            <img 
                className={props.className} 
                style={props.style} 
                src={props.src}
                onClick={() => this.setState({isOpen:true})}
            />
        );
    }
}
//支付提示框    onCancelRequest=取消操作    onConfirmRequest=确认操作    onFreeRequest=免洗操作
//isShow=true/false    status=payment/loading/fail/success/free    free=免费时显示字段    amount=支付金额
export class PayMent extends Component{
    constructor(props) {
        super(props);
        this.state = {authcode:['','','','']}
        this.input = [];
        this.paymentStatus = this.paymentStatus.bind(this);
        this.setAuthCode = this.setAuthCode.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.enterListener = this.enterListener.bind(this);
    }

    enterListener(input) {
        this.input[3] = input;
        if (func.isSet(input)) {
            input.onkeydown = e => {if ('Enter' === e.code) this.onConfirm();}
        }
    }
    
    setAuthCode(e) {
        let value = e.target.value, len = value.length,
            index = Number(e.target.dataset.index),
            authcode = this.state.authcode,autoSubmit = false;
        if (3 !== index && 4 == len) this.input[index + 1].focus();    //判断是否为前三个输入框
        this.state.authcode[index] = value
        this.setState({authcode:this.state.authcode});
    }

    onConfirm() {
        let authcode = this.state.authcode;
        if (
            4 === authcode[0].length
            &&
            4 === authcode[1].length
            &&
            4 === authcode[2].length
            &&
            6 === authcode[3].length
        ) {
            this.props.onConfirmRequest(
                (authcode[0] + authcode[1] + authcode[2] + authcode[3]),
                this.props.amount
            );
        }
    }

    paymentStatus() {
        const status = {}, 
              props = this.props, 
              state = this.state,
              center = {alignItems:'center',justifyContent:'center'};
        // 支付
        status.payment = (
            <div className='ui-payment-box' style={{flexDirection:'column'}}>
                <div 
                    style={{margin:'24px 0 30px 6px',fontSize:'18px',color:'#333'}}
                >支付金额：<span style={{fontSize:'22px',color:'#ff3413'}}>{props.amount}</span></div>
                <div 
                    style={{margin:'0 0 12px 6px',fontSize:'16px',color:'#b2b2b2'}}
                >输入付款码或扫描支付码</div>
                <div className='ui-payment-input-box'>
                    <input 
                        type='text' 
                        value={state.authcode[0]} 
                        onChange={this.setAuthCode} 
                        maxLength='4'
                        data-index='0'
                        autoFocus
                        ref={input => this.input[0] = input}
                    />
                    <input 
                        type='text' 
                        value={state.authcode[1]} 
                        onChange={this.setAuthCode} 
                        maxLength='4'
                        data-index='1'
                        ref={input => this.input[1] = input}
                    />
                    <input 
                        type='text' 
                        value={state.authcode[2]} 
                        onChange={this.setAuthCode} 
                        maxLength='4'
                        data-index='2'
                        ref={input => this.input[2] = input}
                    />
                    <input 
                        type='text' 
                        value={state.authcode[3]} 
                        onChange={this.setAuthCode} 
                        data-index='3'
                        maxLength='6'
                        ref={this.enterListener}
                    />
                </div>
                <div style={{textAlign:'center'}}>
                    <input type='button' className='ui-teamwork-confirm' onClick={this.onConfirm}/>
                </div>
            </div>
        );
        // 支付中
        status.loading = (
            <div className='ui-payment-box' style={center}>
                <div>
                    <div className='ui-payment-loading'></div>
                    <div style={{marginTop:'33px',fontSize:'20px',color:'#b2b2b2',textAlign:'center'}}>支付中</div>
                </div>
            </div>
        );
        // 失败
        status.fail = (
            <div className='ui-payment-box' style={center}>
                <div>
                    <div className='ui-payment-fail'></div>
                    <div style={{marginTop:'24px',fontSize:'22px',color:'#b2b2b2',textAlign:'center'}}>支付失败</div>
                </div>
            </div>
        );
        // 成功
        status.success = (
            <div className='ui-payment-box' style={center}>
                <div>
                    <div className='ui-payment-success'></div>
                    <div style={{marginTop:'22px',fontSize:'22px',color:'#26a4da',textAlign:'center'}}>支付成功</div>
                </div>
            </div>
        );
        // 免费
        status.free = (
            <div className='ui-payment-box' style={{flexDirection:'column'}}>
                <div style={{width:'318px',padding:'42px 20px',lineHeight:'30px',fontSize:'16px',color:'#333'}}>{props.free}</div>
                <div style={{textAlign:'center'}}>
                    <input type='button' className='ui-teamwork-confirm' onClick={props.onFreeRequest}/>
                </div>
            </div>
        );

        return func.isSet(props.status) ? status[props.status] : status.payment;
    }

    render() {
        let props = this.props,
            state = this.state;
        if (!props.isShow) return null;
        return (
            <section className='ui-fixed-bg'>
                <div className='ui-payment'>
                    <div className='ui-mm-layer-title'>
                        <em className='ui-mm-icon-payment'>用户支付</em>
                        <em className='ui-close3' onClick={() => {this.setState({authcode:['','','','']});props.onCancelRequest();}}></em>
                    </div>
                    {this.paymentStatus()}
                </div>
            </section>
        );
    }
}

export class BoxOfImages extends Component{
    constructor(props) {
        super(props);
        this.state = {start:0};
    }

    render() {
        let props = this.props,
            start = this.state.start,
            end = start + 3,
            len = props.children.length,
            showImgs = [];
        if (0 == len) return null;
        for (let i = start;(i < len && i < end);++i) {
            showImgs.push(props.children[i]);
        }
        return (
            <div className='ui-images-box'>
                <em 
                    className={'ui-images-box-previous' + (0 == start ? ' ui-images-box-no-previous' : '')}
                    onClick={() => {if (0 != start) this.setState({start:(start - 1)})}}
                ></em>
                {showImgs}
                <em 
                    className={'ui-images-box-next' + (end >= len ? ' ui-images-box-no-next' : '')}
                    onClick={() => {if (end < len) this.setState({start:(start + 1)})}}
                ></em>
            </div>
        );
    }
}

export class LayerDate extends Component{
    constructor(props) {
        super(props);
        this.state = {chooseTime:'',chooseDay:''};
        this.retClassName = this.retClassName.bind(this);
        this.setStatus = this.setStatus.bind(this);
    }

    setStatus(time, day, e) {
        if ('enabled' === e.target.className) {
            this.setState({chooseTime:time,chooseDay:day});
        }
    }

    retClassName(timeStr, timeArr, dayStr, type) {
        if ('undefined' === typeof type) type = false; 
        let state = this.state,
            className = type ? '可选' : 'enabled';
        if (-1 === timeStr.inArray(timeArr)) className = type ? '不可选' : 'forbidden';
        if (state.chooseTime == timeStr && state.chooseDay == dayStr) {
            className = type ? '已选' : 'choose'
        }
        return className;
    }
    render() {
        let props = this.props,
            state = this.state,
            d = props.Date,
            time = ['8:00~11:00', '11:00~14:00', '14:00~17:00', '17:00~20:00'],
            html = [];
        if (!props.show) return null; 
        if ('undefined' !== typeof d[0].time) {
            html = time.map(s => 
            <tr className='tr2' key={s}>
                <td className='td'>{s}</td>
                <td className={this.retClassName(s, d[0].time, d[0].day)} onClick={(e) => this.setStatus(s,d[0].day,e)}>
                    {this.retClassName(s, d[0].time, d[0].day, true)}
                </td>
                <td className={this.retClassName(s, d[1].time, d[1].day)} onClick={(e) => this.setStatus(s,d[1].day,e)}>
                    {this.retClassName(s, d[1].time, d[1].day, true)}
                </td>
                <td className={this.retClassName(s, d[2].time, d[2].day)} onClick={(e) => this.setStatus(s,d[2].day,e)}>
                    {this.retClassName(s, d[2].time, d[2].day, true)}
                </td>
                <td className={this.retClassName(s, d[3].time, d[3].day)} onClick={(e) => this.setStatus(s,d[3].day,e)}>
                    {this.retClassName(s, d[3].time, d[3].day, true)}
                </td>
                <td className={this.retClassName(s, d[4].time, d[4].day)} onClick={(e) => this.setStatus(s,d[4].day,e)}>
                    {this.retClassName(s, d[4].time, d[4].day, true)}
                </td>
                <td className={this.retClassName(s, d[5].time, d[5].day)} onClick={(e) => this.setStatus(s,d[5].day,e)}>
                    {this.retClassName(s, d[5].time, d[5].day, true)}
                </td>
                <td className={this.retClassName(s, d[6].time, d[6].day)} onClick={(e) => this.setStatus(s,d[6].day,e)}>
                    {this.retClassName(s, d[6].time, d[6].day, true)}
                </td>
            </tr>
            );
        }

        return (
            <div className='ui-fixed-bg'>
                <div className='ui-oe-date'>
                    <div className='ui-oe-title'>
                        <span>请选择取衣时间</span>
                        <img src='images/ui-date-close.png' onClick={props.onCloseRequest}/>
                    </div>
                    <div className='ui-oe-body'>
                        <table className='ui-oe-table'>
                            <thead>
                                <tr className='tr'>
                                    <td className='td'>时间段</td>
                                    <td>{d[0].day}</td>
                                    <td>{d[1].day}</td>
                                    <td>{d[2].day}</td>
                                    <td>{d[3].day}</td>
                                    <td>{d[4].day}</td>
                                    <td>{d[5].day}</td>
                                    <td>{d[6].day}</td>
                                </tr>
                            </thead>
                            <tbody>
                                {html}
                            </tbody>
                        </table>
                        <div style={{marginTop:'20px',width:'100%',textAlign:'center'}}>
                            <input type='button' className='ui-btn ui-btn-cancel ui-btn-middle' value='取消' onClick={props.onCloseRequest}/>
                            &emsp;&emsp;&emsp;
                            <input 
                                type='button' 
                                className='ui-btn ui-btn-confirm ui-btn-middle'
                                value='确认' onClick={() => props.onConfirmRequest(state.chooseDay + '  ' + state.chooseTime, props.id)}/>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}