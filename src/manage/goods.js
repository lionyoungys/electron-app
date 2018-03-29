/**
 * 商品管理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import {Tabs} from '../static/UI';

class Goods extends Component {
    constructor(props) {
        super(props);
        this.state = {tabs:[], items:[], choose:0, editor:{},show:false};
        this.tabChange = this.tabChange.bind(this);
        this.handleEditor = this.handleEditor.bind(this);
        this.itemChange = this.itemChange.bind(this);
        this.handleChangeCycle = this.handleChangeCycle.bind(this);
        this.handleChangePrice = this.handleChangePrice.bind(this);
    }

    componentDidMount() {
        let state = this.state;
        axios.post(api.U('goods'),api.data({token:this.props.token}))
        .then((response) => {
            let result = response.data.data.item_type,
                len = result.length;
            console.log(result);
            for (let i = 0;i < len;++i) {
                state.tabs.push({key:i,text:result[i].er_name});
                state.items.push(result[i].item);
            }
            this.setState({tabs:state.tabs, items:state.items});
        });
    }

    tabChange(e) {this.setState({choose:e.target.dataset.key});}
    handleEditor(obj) {
        this.setState({
            editor:{cycle:obj.cycle,id:obj.id,name:obj.name,price:obj.price,tid:obj.tid},
            show:true
        });
    }
    itemChange(state) {
        let editor = this.state.editor;
        if ('cancel' === state) {
            this.setState({show:false});
        } else if ('delete' === state) {
            axios.post(api.U('deleteGoods'),api.data({token:this.props.token,id:editor.id}))
            .then((response) => {
                if (api.verify(response.data)) {
                    let arr = this.state.items[this.state.choose],
                        index = editor.id.inObjectArray(arr,'id');
                    arr.splice(index,1);
                    this.setState({items:this.state.items,show:false});
                }
            });
        } else if ('confirm' === state) {
            axios.post(
                api.U('updateGoods'),
                api.data({
                    token:this.props.token,
                    id:editor.id,
                    price:editor.price,
                    cycle:editor.cycle
                })
            )
            .then((response) => {
                if (api.verify(response.data)) {
                    let arr = this.state.items[this.state.choose],
                        index = editor.id.inObjectArray(arr,'id');
                    arr[index].price = editor.price;
                    arr[index].cycle = editor.cycle;
                    this.setState({items:this.state.items,show:false});
                }
            });
        }
    }
    handleChangePrice(e) {
        this.state.editor.price = e.target.value;
        this.setState({editor:this.state.editor});
    }
    handleChangeCycle(e) {
        this.state.editor.cycle = e.target.value;
        this.setState({editor:this.state.editor});
    }

    render () {
        let props = this.props,
            state = this.state,
            html = null;
        if ('undefined' !== typeof state.items[state.choose]) {
            html = state.items[state.choose].map((obj) => 
                <Row 
                    key={obj.id} 
                    obj={obj} 
                    category={state.tabs[state.choose].text}
                    callback={this.handleEditor}
                />
            );
        }
        return (
            <div>
                <div className='ui-container'>
                    <div className='ui-box-between'>
                        <Tabs tabs={state.tabs} choose={state.choose} callback={this.tabChange}/>
                        <input 
                            type='button' 
                            value='+添加商品' 
                            className='ui-btn ui-btn-confirm ui-btn-large'
                            data-e='goods_add'
                            onClick={props.changeView}
                        />
                    </div>
                    <div className='ui-content'>
                        <table className='ui-table'>
                            <thead className='ui-fieldset'>
                                <tr className='ui-tr-h'>
                                    <th>名称</th>
                                    <th>所属分类</th>
                                    <th>价格</th>
                                    <th>洗护周期</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody className='ui-fieldset'>{html}</tbody>
                        </table>
                    </div>
                </div>
                <Editor 
                    show={state.show} 
                    callback={this.itemChange} 
                    obj={state.editor}
                    priceCallback={this.handleChangePrice}
                    cycleCallback={this.handleChangeCycle}
                />
            </div>
        );
    }
}

class Row extends Component{
    constructor(props) {
        super(props);
        this.handleEditor = this.handleEditor.bind(this);
    }

    handleEditor() {this.props.callback(this.props.obj);}

    render() {
        let props = this.props,
            obj = props.obj;
        return (
             <tr className='ui-tr-d'>
                <td>{obj.name}</td>
                <td>{props.category}</td>
                <td>{obj.price}</td>
                <td>预计{obj.cycle}天</td>
                <td>
                    <input 
                        type='button' 
                        value='编辑' 
                        className='ui-btn ui-btn-editor' 
                        onClick={this.handleEditor}
                    />
                </td>
            </tr>
        );
    }
}

class Editor extends Component{
    constructor(props) {
        super(props);
        this.cancel = this.cancel.bind(this);
        this.delete = this.delete.bind(this);
        this.confirm = this.confirm.bind(this);
    }
    cancel() {this.props.callback('cancel');}
    delete() {this.props.callback('delete');}
    confirm() {this.props.callback('confirm');}
    render() {
        if (!this.props.show) return null;
        let obj = this.props.obj;
        return (
            <section className='ui-alert-bg'>
                <div className='ui-goods-layer'>
                    <header className='ui-goods-layer-title'>
                        {obj.name}<em className='ui-close right' onClick={this.cancel}></em>
                    </header>
                    <div className='ui-goods-layer-body'>
                        <div className='ui-goods-layer-between'>
                            <span>&emsp;&emsp;价格：</span>
                            <input type='text' value={obj.price} onChange={this.props.priceCallback}/>
                            <span>元</span>
                        </div>
                        <div className='ui-goods-layer-between'>
                            <span>洗护周期：</span>
                            <input type='text' value={obj.cycle} onChange={this.props.cycleCallback}/>
                            <span>天</span>
                        </div>
                    </div>
                    <div className='ui-box-between' style={{padding:'0 20px'}}>
                        <input 
                            type='button' 
                            value='删除' 
                            className='ui-btn ui-btn-cancel ui-btn-large'
                            onClick={this.delete}
                        />
                        <input 
                            type='button' 
                            value='确认' 
                            className='ui-btn ui-btn-confirm ui-btn-large'
                            onClick={this.confirm}
                        />
                    </div>
                </div>
            </section>
        );
    }
}

export default Goods;