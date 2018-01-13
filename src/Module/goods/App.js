/**
 * 商品管理界面组件
 * @author yangyunlong
 */

import React from 'react';
import Crumb from '../UI/crumb/App';
import Radio from '../UI/radio/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {category:[],items:[],checked:0,show:false,data:{}};
        this.handleClick=this.handleClick.bind(this);
        this.editor = this.editor.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        axios.post(api.U('goods'),api.D({token:this.props.token}))
        .then(response => {
            console.log(response);
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
            console.log(response.data);
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
                        <button type='button' className='m-btn m-btn-confirm' data-id={obj.id}>删除</button>
                        &emsp;
                        <button type='button' className='m-btn m-btn-editor' data-id={obj.id} onClick={this.editor}>编辑</button>
                    </td>
                </tr>
            );
        }
        return (
            <div>
                <Crumb data={[{key:0,value:'商品管理'}]} callback={this.props.changeView}/>
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
            <div className='m-layer-bg'>
                <div className='goods-layer'>
                    <i className='m-close' onClick={this.props.onCloseRequest}></i>
                    <div><span className='m-clothes'>编辑</span></div>
                    <div className='row'>
                        <label>名称:</label><span>{data.item_name}</span>
                    </div>
                    <div className='row'>
                        <label>价格:</label>
                        <input
                            type='text'
                            className='m-text-c'
                            value={data.item_price}
                            onChange={e => this.props.onChange(e.target.value,'item_price')}
                        />&nbsp;&nbsp;元
                    </div>
                    <div className='row'>
                        <label>洗护周期:</label>
                        <input
                            type='text'
                            className='m-text-c'
                            value={data.item_cycle}
                            onChange={e => this.props.onChange(e.target.value,'item_cycle')}
                        />&nbsp;&nbsp;天
                    </div>
                    <div className='row'>
                        <label>普客折扣:</label>
                        <input
                            type='text'
                            className='m-text-c'
                            value={data.item_discount}
                            onChange={e => this.props.onChange(e.target.value,'item_discount')}
                        />&nbsp;&nbsp;折
                    </div>
                    <div className='row'>
                        <label>会员是否打折:</label>
                        <span>
                            <Radio checked={1 == data.has_discount} onClick={this.handleClick}>是</Radio>
                            &emsp;&emsp;
                            <Radio checked={0 == data.has_discount} onClick={this.handleClick}>否</Radio>
                        </span>
                    </div>
                    <div className='row'>
                        <label className='label'>洗后预估:</label>
                        <div>
                            <textarea
                                value={data.item_forecast}
                                maxLength='10'
                                onChange={e => this.props.onChange(e.target.value,'item_forecast')}
                            ></textarea>
                            <i className='m-counter'>{data.item_forecast.length}/10</i>
                        </div>
                    </div>
                    <div className='row'>
                        <label></label>
                        <button type='button' className='m-btn gradient lightblue middle'>确定</button>
                    </div>
                </div>
            </div>
        );
    }
}