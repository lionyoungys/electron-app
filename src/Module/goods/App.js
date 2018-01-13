/**
 * 商品管理界面组件
 * @author yangyunlong
 */

import React from 'react';
import Crumb from '../UI/crumb/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {category:[],items:[],checked:0};
        this.handleClick=this.handleClick.bind(this);
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
                        <button type='button' className='m-btn m-btn-editor' data-id={obj.id}>编辑</button>
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
            </div>
        );
    }
}