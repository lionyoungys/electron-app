/**
 * 商品添加界面组件
 * @author yangyunlong
 */

import React from 'react';
import Checkbox from '../UI/checkbox/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:[],checked:[]};
        this.handleClick = this.handleClick.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        axios.post(api.U('goods_list'),api.D({token:this.props.token}))
        .then(response => {
            api.V(response.data) && this.setState({data:response.data.result});
            console.log(response.data);
        });
    }
    handleClick(value, checked) {
        if (checked) {
            let index = value.inArray(this.state.checked);
            if (-1 !== index) this.state.checked.splice(index, 1); 
        } else {
            this.state.checked.push(value);
        }
        this.setState({checked:this.state.checked});
    }
    submit() {
        if (this.state.checked.length < 1) return alert('请选择项目');
        axios.post(api.U('goods_add'), api.D({token:this.props.token,item_json:JSON.stringify(this.state.checked)}))
        .then(response => {
            api.V(response.data) && this.props.changeView({view:'goods'});
            console.log(response.data);
        });
    }
    render() {
        let html = this.state.data.map(obj => 
            <div key={obj.id}>
                <div className='goods-add-cate'>{obj.cate_name}</div>
                <Items data={obj.item} checked={this.state.checked} handleClick={this.handleClick}/>
            </div>
        );
        return (
            <div>
                <div className='m-container'>
                    <div style={{textAlign:'right'}}>
                        <button type='button' className='m-btn middle confirm' onClick={this.submit}>确定</button>
                    </div>
                    <div className='m-box'>{html}</div>
                </div>
            </div>
        );
    }
}

class Items extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let html = this.props.data.map(obj => 
            <Checkbox
                key={obj.id}
                value={obj.id}
                onClick={this.props.handleClick}
                checked={-1 !== obj.id.inArray(this.props.checked)}
            >{obj.item_name}</Checkbox>
        );
        return (
            <div className='goods-add-box'>{html}</div>
        );
    }
}