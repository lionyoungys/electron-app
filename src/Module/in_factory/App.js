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
        this.onChecked = this.onChecked.bind(this);
        this.query = this.query.bind(this);
    }
    componentDidMount() {
        this.query();
    }
    query() {
        axios.post(api.U('in_factory'),api.D({token:this.props.token}))
        .then(response => {
            console.log(response.data);
            api.V(response.data) && this.setState({data:response.data.result});
        });
    }
    handleAllChecked(value, checked) {
        if (checked) {
            this.setState({checked:[],all:false});
        } else {
            let data = this.state.data, len = data.length;
            if (len < 1) return;
            let tempLen = null, checked = [];
            for (let i = 0;i < len;++i) {
                tempLen = data[i].list.length;
                if (tempLen < 1) continue;
                for (let j = 0;j < tempLen;++j) {
                    checked.push(data[i].list[j].id);
                }
            } 
            this.setState({checked:checked,all:true});
        }
    }
    onChecked(value, checked) {
        if (checked) {
            let index = value.inArray(this.state.checked);
            if (-1 !== index) {
                this.state.checked.splice(index, 1);
                this.setState({checked:this.state.checked,all:false});
            }
        } else {
            this.state.checked.push(value);
            this.setState({checked:this.state.checked});
        }
    }
    handleClick() {    //退回
        if (this.state.checked.length < 1) return;
        axios.post(
            api.U('into_factory'),
            api.D({token:this.props.token,itemids:this.state.checked.toString(),moduleid:22})
        )
        .then(response => {
            if (api.V(response.data)) {
                this.setState({checked:[],all:false});
                this.query();
            } else {
                alert(response.data.msg);
            }
        });
    }

    render() {
        let html = this.state.data.map(obj => 
            <div className='m-box' key={obj.date}>
                <div className='in-factory-date'>{obj.date}</div>
                    <table className='m-table m-text-c tr-b'>
                        <thead><tr className='m-bg-white'><th>衣物编码</th><th>名称</th></tr></thead>
                        <Tbody data={obj.list} onChecked={this.onChecked} checked={this.state.checked}/>
                    </table>
            </div>
        );
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
                    {html}
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
        let html = this.props.data.map(obj => 
            <tr key={obj.id}>
                <td>
                    <Checkbox
                        value={obj.id}
                        checked={-1 !== obj.id.inArray(this.props.checked)}
                        onClick={this.props.onChecked}
                    >{obj.clean_sn}</Checkbox>
                </td>
                <td>{obj.item_name}</td>
            </tr>
        );
        return (<tbody>{html}</tbody>);
    }
}