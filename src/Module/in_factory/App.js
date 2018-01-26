/**
 * 商品添加界面组件
 * @author yangyunlong
 */

import React from 'react';
import Crumb from '../UI/crumb/App';
import Checkbox from '../UI/checkbox/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:[], checked:[], all:false};
        this.handleAllChecked = this.handleAllChecked.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        axios.post(api.U('in_factory'),api.D({token:this.props.token}))
        .then(response => {
            console.log(response.data);
            api.V(response.data) && this.setState({data:response.data.result});
        });
    }
    handleAllChecked() {
        let data = this.state.data,len = data.length;
        if (len < 1) return;
        let tempLen = null, checked = [];
        for (let i = 0;i < len;++i) {
            tempLen = data[i].list.length;
            if (tempLen < 1) continue;
            for (let j = 0;j < tempLen;++j) {
                checked.push(data[i].list[j]);
            }
        } 
        this.setState({checked:checked,all:true});
    }
    handleClick() {

    }

    render() {
        return (
            <div>
                <Crumb data={[{key:0,value:'入厂'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div className='m-text-r'>
                        <span>已选择<span className='m-red'>{this.state.checked.length}</span>件</span>
                        &emsp;
                        <Checkbox checked={this.state.all} onClick={this.handleAllChecked}>全选</Checkbox>
                        &emsp;
                        <button className='m-btn confirm middle' onClick={this.handleClick}>退回</button>
                    </div>
                    <div className='m-box'>
                        <div style={{textAlign:'center',fontSize:'18px',lineHeight:'30px'}}>2017-11-11 12:10:50</div>
                        <table className='m-table m-text-c tr-b'>
                            <thead><tr className='m-bg-white'><th>衣物编码</th><th>名称</th></tr></thead>
                            <Tbody/>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

class Tbody extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tbody>
                <tr>
                    <td><Checkbox>12121311545</Checkbox></td>
                    <td>dfdfdfdfffdff</td>
                </tr>
            </tbody>
        );
    }
}