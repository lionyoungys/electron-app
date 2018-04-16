/**
 * 商品管理界面组件
 * @author yangyunlong
 */

import React from 'react';
import Radio from '../UI/radio/App';
import OptionBox from '../../Elem/OptionBox';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {category:[],items:[],checked:0,show:false,data:{}};
        this.handleClick=this.handleClick.bind(this);
        this.editor = this.editor.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        axios.post(api.U('goods'),api.D({token:this.props.token}))
        .then(response => {
            if (api.V(response.data)) {
                let result = response.data.result,
                    len = result.length;
                for (let i = 0;i < len;++i) {
                    this.state.category.push({key:i,value:result[i].cate_name});
                    this.state.items.push(result[i].items);
                }
                this.setState({category:this.state.category,items:this.state.items});
            }
        });
    }

    handleClick(e) {this.setState({checked:e.target.dataset.key})}
    editor(e) {
        axios.post(api.U('goods_detail'),api.D({token:this.props.token,item_id:e.target.dataset.id}))
        .then(response => {
            api.V(response.data) && this.setState({
                show:true,
                data:response.data.result
            });
        });
    }
    handleChange(value, key) {
        this.state.data[key] = value;
        this.setState({data:this.state.data});
    }
    handleConfirm() {
        let data = this.state.data;
        data.token = this.props.token;
        data.item_id = data.id;
        delete data.id;
        axios.post(api.U('goods_editor'), api.D(data))
        .then(response => {
            if (api.V(response.data) || 1000 == response.data.code) {
                let index = data.item_id.inObjectArray(this.state.items[this.state.checked], 'id');
                if (-1 !== index) {
                    this.state.items[this.state.checked][index].item_price = data.item_price;
                    this.setState({items:this.state.items, show:false});
                }
            }
        });
    }
    handleDelete(e) {
        let id = e.target.dataset.id;
        axios.post(api.U('goods_delete'), api.D({token:this.props.token,item_id:id}))
        .then(response => {
            console.log(response.data);
            if (api.V(response.data)) {
                let index = id.inObjectArray(this.state.items[this.state.checked], 'id');
                if (-1 !== index) {
                    this.state.items[this.state.checked].splice(index, 1);
                    this.setState({items:this.state.items});
                }
            }
        });
    }

    render() {
        let html = null;
        let tab = this.state.category.map(obj => 
            <span
                key={obj.key}
                data-key={obj.key}
                className={'m-tab' + (this.state.checked == obj.key ? ' checked': '')}
                onClick={this.handleClick}
            >{obj.value}</span>
        );
        if (this.state.items.length > 0) {
            html = this.state.items[this.state.checked].map(obj => 
                <tr className='bd-lightgrey m-text-c' key={obj.id}>
                    <td>{obj.item_name}</td>
                    <td>{this.state.category[this.state.checked].value}</td>
                    <td>{obj.item_price}</td>
                    <td>
                        <button type='button' className='m-btn m-btn-confirm' data-id={obj.id} onClick={this.handleDelete}>删除</button>
                        &emsp;
                        <button type='button' className='m-btn m-btn-editor' data-id={obj.id} onClick={this.editor}>编辑</button>
                    </td>
                </tr>
            );
        }
        return (
            <div>
                <div className='m-container'>
                    <div>{tab}</div>
                    <div className='m-box' style={{textAlign:'right'}}>
                        <button
                            type='button'
                            className='m-btn m-btn-confirm m-btn-middle'
                            data-view='goods_add'
                            onClick={this.props.changeView}
                        >+添加商品</button>
                    </div>
                    <div className='m-box'>
                        <table className='m-table'>
                            <thead>
                                <tr className='m-bg-white bd-lightgrey'>
                                    <th>名称</th>
                                    <th>所属分类</th>
                                    <th>价格</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                </div>
                <GoodsLayer
                    data={this.state.data}
                    show={this.state.show}
                    onCloseRequest={() => this.setState({show:false})}
                    onChange={this.handleChange}
                    onConfirm={this.handleConfirm}
                />
            </div>
        );
    }
}

class GoodsLayer extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(value) {
        this.props.onChange(('是' == value ? 1 : 0),'has_discount');
    }

    render() {
        if (!this.props.show) return null;
        let data = this.props.data;
        return (
            <div className='good-layer'>
                <div>编辑商品</div>
                <div className='good-row'><span>商品：</span>{data.item_name}</div>
                <div className='good-row'>
                    <span>*价格：</span>
                    <input
                        type='text'
                        value={data.item_price}
                        onChange={e => this.props.onChange(e.target.value,'item_price')}
                    />&nbsp;&nbsp;元
                </div>
                <div className='good-row'>
                    <span>*普客折扣：</span>
                    <input
                        type='text'
                        value={data.item_discount}
                        onChange={e => {
                            let value = e.target.value;
                            if (isNaN(value) || value > 10 || value.toString().length > 4) return;
                            this.props.onChange(value,'item_discount')
                        }}
                    />&nbsp;&nbsp;折&emsp;&emsp;
                    <span className='e-red'>打折后价格：&yen;{( Math.floor(data.item_price * 100) * Math.floor(data.item_discount * 100) ) / 100000}</span>
                </div>
                <div className='good-row'>
                    <span>*会员是否打折：</span>
                    <OptionBox type='radio' checked={1 == data.has_discount} onClick={this.handleClick}>是</OptionBox>
                    &emsp;&emsp;
                    <OptionBox type='radio' checked={0 == data.has_discount} onClick={this.handleClick}>否</OptionBox>
                </div>
                <div style={{height:'22px'}}></div>
                <div style={{padding:'0 14px'}}>
                    <div style={{fontWeight:'bold',borderBottom:'1px solid #ccc',fontSize:'14px',paddingBottom:'9px'}}>收衣界面自动填充设置</div>
                </div>
                <div className='good-row'>
                    <span>洗护周期：</span>
                    <input
                        type='text'
                        value={data.item_cycle}
                        onChange={e => {
                            let value = e.target.value;
                            if (isNaN(value)) return;
                            this.props.onChange(value,'item_cycle')
                        }}
                    />&nbsp;&nbsp;天&emsp;&emsp;&emsp;
                    <span className='e-grey'>提示：设置后可自动填充取衣时间</span>
                </div>
                <div className='good-row'>
                    <span>瑕疵：</span>
                    <input
                        type='text'
                        className='good-row-long-input'
                        value={data.item_flaw}
                        onChange={e => {
                            let value = e.target.value;
                            if (value.length>20) return;
                            this.props.onChange(value,'item_flaw')
                        }}
                    />
                    <span className='e-counter'>{data.item_flaw.length}/20</span>
                </div>
                <div className='good-row'>
                    <span>洗后预估：</span>
                    <input
                        type='text'
                        className='good-row-long-input'
                        value={data.item_forecast}
                        onChange={e => {
                            let value = e.target.value;
                            if (value.length>20) return;
                            this.props.onChange(value,'item_forecast')
                        }}
                    />
                    <span className='e-counter'>{data.item_forecast.length}/20</span>
                </div> 
                <div className='good-button-area'>
                    <button type='button' className='e-btn cancel' onClick={this.props.onCloseRequest}>取消</button>
                    &emsp;&emsp;&emsp;&emsp;
                    <button type='button' className='e-btn confirm' onClick={this.props.onConfirm}>确定</button>
                </div>
            </div>
        );
    }
}