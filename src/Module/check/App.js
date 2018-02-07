/**
 * 质检界面组件
 * @author yangyunlong
 */

import React from 'react';
import Crumb from '../UI/crumb/App';
import Search from '../UI/search/App';
import Checkbox from '../UI/checkbox/App';
const state = 52, word = '质检';
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value:'',data:[],checked:[],all:false};
        this.onSearch = this.onSearch.bind(this);
        this.handleAllChecked = this.handleAllChecked.bind(this);
        this.handleCleaned = this.handleCleaned.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
        this.query = this.query.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {this.query()}
    query() {
        axios.post(api.U('item_list'),api.D({token:this.props.token,state:state}))
        .then(response => {
            api.V(response.data) && this.setState({data:response.data.result,value:''});
        });
    }
    onSearch() {
        axios.post(api.U('operate_search'),api.D({token:this.props.token,status:state,clean_sn:this.state.value}))
        .then(response => {
            api.V(response.data) && this.query();
        });
    }

    handleAllChecked(value, checked) {
        if (checked) {
            this.setState({checked:[],all:false});
        } else {
            let data = this.state.data,
                len = data.length,
                checked = [];
            for (let i = 0;i < len;++i) {
                if (data[i].assist == 0) checked.push(data[i].id);
            }
            this.setState({checked:checked,all:true});
        }
    }
    handleChecked(value,checked) {
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
    handleCleaned() {
        if (this.state.checked.length < 1) return;
        axios.post(api.U('handle_done'),api.D({token:this.props.token,itemids:this.state.checked.toString(),moduleid:state}))
        .then(response => {
            if (api.V(response.data)) {
                this.setState({checked:[],all:false});
                this.query();
            } else {
                alert(response.data.msg);
            }
        });
    }
    goBack() {
        if (this.state.checked.length != 1) return alert('返流项目需选中单个项目返流');
        this.props.changeView({view:'go_back',param:{state:state,id:this.state.checked[0]}});
    }
    render() {
        let html = this.state.data.map(obj => 
            <tr key={obj.id} className={obj.assist == 1 ? 'm-grey' : null}>
                <td>
                    {
                        obj.assist == 1
                        ?
                        obj.clean_sn
                        :
                        <Checkbox
                            value={obj.id}
                            checked={-1 !== obj.id.inArray(this.state.checked)}
                            onClick={this.handleChecked}
                        >{obj.clean_sn}</Checkbox>
                    }
                </td>
                <td>{obj.item_name}</td>
            </tr>
        );
        return (
            <div>
                <Crumb data={[{key:0,value:word}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div className='clean-box'>
                        <Search 
                            placeholder='请输入或扫描衣物编码'
                            value={this.state.value}
                            onChange={value => this.setState({value:value})}
                            callback={this.onSearch}
                        />
                        <div>
                            已选择<span className='m-red'>{this.state.checked.length}</span>件
                            &emsp;
                            <Checkbox checked={this.state.all} onClick={this.handleAllChecked}>全选</Checkbox>
                            &emsp;
                                <button type='button' className='m-btn confirm middle' onClick={this.goBack}>返流</button>
                            &emsp;
                            <button type='button' className='m-btn confirm middle' onClick={this.handleCleaned}>已{word}</button>
                        </div>
                    </div>
                    <div className='m-box'>
                        <table className='m-table tr-b m-text-c'>
                            <thead><tr className='m-bg-white'><th>衣物编码</th><th>名称</th></tr></thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}