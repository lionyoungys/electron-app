/**
 * 出厂界面组件
 * @author yangyunlong
 */

import React from 'react';
import Crumb from '../UI/crumb/App';
import Checkbox from '../UI/checkbox/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:[], checked:[], all:false, teamId:'',team:[]};
        this.handleAllChecked = this.handleAllChecked.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onChecked = this.onChecked.bind(this);
        this.query = this.query.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        axios.post(api.U('team_merchant'),api.D({token:this.props.token}))
        .then(response => {
            if (api.V(response.data)) {
                let result = response.data.result,
                    teamId = ( tool.isSet(result[0]) ? result[0].accept_id : null );
                this.setState({team:result,teamId:teamId});
                this.query(teamId);
            }
            console.log(response.data);
        });
    }
    query(teamId) {
        teamId = tool.isSet(teamId) ? teamId : this.state.teamId;
        axios.post(api.U('out_of_factory'),api.D({token:this.props.token, mer_id:teamId}))
        .then(response => {
            console.log(response.data);
            api.V(response.data) && this.setState({data:response.data.result.data});
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
                    if (data[i].list[j].assist == 0) checked.push(data[i].list[j].id);
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
    handleChange(e) {
        let value = e.target.value;
        this.setState({teamId:value});
        this.query(value);
        console.log(value);
    } 
    handleClick() {    //出厂
        if (this.state.checked.length < 1 || '' === this.state.teamId) return;
        axios.post(
            api.U('into_factory'),
            api.D({token:this.props.token,itemids:this.state.checked.toString(),moduleid:21,targetmid:this.state.teamId})
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
        let options = this.state.team.map(obj => 
            <option
                key={obj.accept_id}
                value={obj.accept_id}
            >{obj.mname}</option>
        );
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
                <Crumb data={[{key:0,value:'出厂'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div className='clean-box'>
                        <div>选择门店：<select onChange={this.handleChange} value={this.state.teamId}>{options}</select></div>
                        
                        <div>
                            <span>已选择<span className='m-red'>{this.state.checked.length}</span>件</span>
                            &emsp;
                            <Checkbox checked={this.state.all} onClick={this.handleAllChecked}>全选</Checkbox>
                            &emsp;
                            <button className='m-btn confirm middle' onClick={this.handleClick}>打包出厂</button>
                            </div>
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
            <tr key={obj.id} className={obj.assist == 1 ? 'm-grey' : null}>
                <td>
                    {
                        obj.assist == 1
                        ?
                        obj.clean_sn
                        :
                        <Checkbox
                            value={obj.id}
                            checked={-1 !== obj.id.inArray(this.props.checked)}
                            onClick={this.props.onChecked}
                        >{obj.clean_sn}</Checkbox>
                    }
                </td>
                <td>{obj.item_name}</td>
            </tr>
        );
        return (<tbody>{html}</tbody>);
    }
}