/**
 * UI组件库
 * @author yangyunlong
 */
import React, {Component} from 'react';
import './UI.css';
import './func';
//面包屑导航栏 crumbs = [{key:索引key,e:跳转的视图组件,text:文字显示}] [index=首页跳转] [callback=回调操作]
class Crumbs extends Component {
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
class Tabs extends Component {
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
            state = this.state;
        return (
            <div className='ui-search'>
                <input type='text' placeholder={props.placeholder} onChange={this.handleChange}/>
                <input type='button' defaultValue='搜索' data-word={state.word} onClick={props.callback}/>
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
                display:props.display ? 'inline-block' : 'none',overflow:'hidden',
                position:'fixed',left:'calc((100% - 180px) / 2)',top:top
            };
            if ('boolean' === typeof props.show && !props.show) return null;
        return (<div style={style}>{props.text}</div>);
    }
}
//相对定位提示框    show=true/false width=宽度
class Notification extends Component {
    constructor(props) {super(props);}
    render() {
        let props = this.props,
            style = {
                width:props.width + 'px', 
                position:'fixed',
                top:'calc((100% - 30px) / 2)',
                left:'calc((100% - ' + props.width + 'px) / 2)'
            };
        if (!props.show) return null;
        return (<div className='ui-notification' style={style}>{props.children}</div>);
    }
} 
//多选弹出框    show=true/false title=标题 button=按钮内容 是否展示 checkboxs=[{text:text,key:key}]
class CheckboxAlert extends Component {
    constructor(props) {
        super(props);
        this.checkedList = [];
        this.onClose = this.onClose.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    onClose() {
        this.checkedList = [];
        this.props.onClose();
    }
    onConfirm() {this.props.callback(this.checkedList);}
    handleClick(e) {
        let node = e.target,
            text = e.target.innerText;
        if (node.classList.contains('ui-checked')) {    //判断是否选中状态
            let index = text.inArray(this.checkedList);
            this.checkedList.splice(index,1);    //清除选中
        } else {
            this.checkedList.push(text);    //添加选中
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
class Math extends Component {
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
class Special extends Component {
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
//问题描述及颜色设置菜单栏    header 大分类    options 选项列表及小分类    chosenArr 已选择的列表数组    callback 选中／取消切换
class QCmenu extends Component {
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
            <div className='ui-question-container '>
                <div className='ui-question-title'>
                    <span>{props.header}</span>
                    <em className={icon} onClick={this.toggleState}></em>
                </div>
                <div style={display}>{html}</div>
            </div>
        );
    }
}

export default Crumbs;
export {Tabs,Search,Notice,CheckboxAlert,Math,Special,QCmenu,Notification};