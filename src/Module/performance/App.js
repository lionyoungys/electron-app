/**
 * 业绩统计组件
 * @author yangyunlong
 */

import React from 'react';
import Crumb from '../UI/crumb/App';
import Checkbox from '../UI/checkbox/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            start:tool.date('Y-m-01'),
            end:tool.date('Y-m-d'),
            employeeID:'all',
            employees:[{id:'all', name:'全部'}],
            data:[],
            current:{id:'', name:''}
        };
        this.handleChange = this.handleChange.bind(this);
        this.query = this.query.bind(this);
    }
    componentDidMount() {
        laydate.render({
            elem:this.input,
            min:'2016-01-01',max:0,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:value => {
                this.setState({start:value});
                this.query({start_time:value});
            }
        });
        laydate.render({
            elem:this.input2,
            min:'2016-01-01',max:0,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:value => {
                this.setState({end:value});
                this.query({end_time:value});
            }
        });
        api.post('employee_list', {token:this.props.token}, response => {
            if (api.V(response.data)) {
                let result = response.data.result,
                    len = result.length;
                for (let i = 0;i < len;++i) {
                    this.state.employees.push({id:result[i].id, name:result[i].aname});
                }
                this.setState({employees:this.state.employees});
            }
        });
        this.query();
    }

    handleChange(e) {
        let value = e.target.value;
        this.setState({employeeID:value});
        this.query({staff_id:value});
    }

    query(params) {
        if ('object' !== typeof params) params = {};
        params.token = this.props.token;
        if (!tool.isSet(params.staff_id)) params.staff_id = this.state.employeeID;
        if (!tool.isSet(params.start_time)) params.start_time = this.state.start;
        if (!tool.isSet(params.end_time)) params.end_time = this.state.end;
        api.post(
            'performance', 
            params,
            response => {
                if (api.V(response.data)) {
                    let result = response.data.result;
                    this.setState({data:result.list, current: {id:result.sta_number, name:result.sta_name}})
                }
                
            }
        );
    }
    render() {
        let options = this.state.employees.map(obj => 
            <option key={obj.id} value={obj.id}>{obj.name}</option>
        );
        let html = this.state.data.map(obj => 
            <tr className='m-text-c bd-lightgrey' key={obj.module}>
                <td>{obj.module_name}</td>
                <td>{this.state.current.name}/{this.state.current.id}</td>
                <td>{obj.num}</td>
                <td>{obj.num_back}</td>
            </tr>
        );
        return (
            <div>
                <Crumb data={[{key:0,value:'业绩统计'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div>
                        操作者:&nbsp;<select value={this.state.employeeID} onChange={this.handleChange}>{options}</select>
                        &emsp;
                        时间:&nbsp;
                        <input type='text' className='m-text-c m-small m-input-small' value={this.state.start} ref={input => this.input = input} readOnly placeholder='开始日期'/>
                        &nbsp;--&nbsp;
                        <input type='text' className='m-text-c m-small m-input-small' value={this.state.end} ref={input => this.input2 = input} readOnly placeholder='结束日期'/>
                    </div>
                    <div className='m-box'>
                        <table className='m-table'>
                            <thead><tr className='m-text-c bd-lightgrey m-bg-white'>
                                <th>工序名称</th><th>操作者姓名/编号</th><th>处理件数</th><th>返流次数</th>
                            </tr></thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}