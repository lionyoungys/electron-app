/**
 * 出厂界面组件
 * @author yangyunlong
 */
const {ipcRenderer} = window.require('electron');
import React from 'react';
import OptionBox from '../../Elem/OptionBox';
import Empty from '../../Elem/Empty';
import Select from '../../Elem/Select';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.props.onRef(this);
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
    handleChange(value) {
        this.setState({teamId:value});
        this.query(value);
        console.log(value);
    } 
    handleClick() {    //出厂
        if (this.state.checked.length < 1 || '' === this.state.teamId) return;
        axios.post(
            api.U('new_into_factory'),
            api.D({token:this.props.token,itemids:this.state.checked.toString(),moduleid:21,targetmid:this.state.teamId})
        )
        .then(response => {
            if (api.V(response.data)) {
                let res = response.data.result;
                ipcRenderer.send(
                    'print-silent',
                    'public/prints/out_of_factory.html',
                    {factory:res.fromName,merchant:res.targetName,employee:res.operatorName,count:res.count}
                );
                this.setState({checked:[],all:false});
                this.query();
            } else {
                alert(response.data.msg);
            }
        });
    }

    render() {
        let option = this.state.team.map(obj => {
            return {key:obj.accept_id, value:obj.mname};
        });
        let html = this.state.data.map(obj => 
            <div className='m-box' key={obj.date}>
                <div className='in-factory-date'>{obj.date}</div>
                    <table className='m-table m-text-c tr-b'>
                        <thead><tr className='m-bg-white'><th>衣物编码</th><th>名称</th><th>衣挂号</th></tr></thead>
                        <Tbody data={obj.list} onChecked={this.onChecked} checked={this.state.checked}/>
                    </table>
            </div>
        );
        return (
            <div style={{paddingTop:'56px'}}>
                <div className='clean-top'>
                    <div className='left'>
                        <OptionBox type='checkbox' checked={this.state.all} onClick={this.handleAllChecked}>全选</OptionBox>
                        &emsp;&emsp;
                        已选择<span className='e-orange'>&nbsp;{this.state.checked.length}&nbsp;</span>件
                        &emsp;&nbsp;
                        <button className='e-btn confirm' onClick={this.handleClick}>打包出厂</button>
                    </div>
                    <div className='right'>
                        选择门店：<Select option={option} onChange={this.handleChange} selected={this.state.teamId}/>
                    </div>
                </div>
                {html}
                <Empty show={this.state.data.length < 1}/>
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
                        <OptionBox
                            value={obj.id}
                            checked={-1 !== obj.id.inArray(this.props.checked)}
                            onClick={this.props.onChecked}
                        >{obj.clean_sn}</OptionBox>
                    }
                </td>
                <td>{obj.item_name}</td>
                <td>{obj.put_sn}</td>
            </tr>
        );
        return (<tbody>{html}</tbody>);
    }
}