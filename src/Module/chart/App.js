/**
 * 经营分析组件
 * @author yangyunlong
 */
import React from 'react';
import Chart from '../UI/chart-default/App';
import Select from '../../Elem/Select';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.props.onRef(this);
        this.input = null;
        this.state = {
            current:{},
            previous:{},
            statistics:{},
            currentAmount:0,
            previousAmount:0,
            currentData:[],
            previousData:[],
            date:[],
            selected:''
        };
        this.query = this.query.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {this.query()}

    query(date) {
        date = tool.isSet(date) ? date : this.state.selected;
        axios.post(
            api.U('chart'),
            api.D({token:this.props.token,date:date})
        )
        .then(respones => {
            console.log(respones.data);
            if (api.V(respones.data)) {
                let result = respones.data.result,
                    cLen = result.now_month_data.length,
                    pLen = result.last_month_data.length,
                    currentData = [], previousData = [];
                for (let i = 0;i < cLen;++i) {
                    currentData.push(result.now_month_data[i].total * 1);
                }
                for (let i = 0;i < pLen;++i) {
                    previousData.push(result.last_month_data[i].total * 1);
                }
                this.setState({
                    current:result.now_info,
                    previous:result.last_info,
                    statistics:result.increase,
                    currentAmount:result.now_business_total,
                    previousAmount:result.before_business_total,
                    currentData:currentData,
                    previousData:previousData,
                    date:result.monarr,
                    selected:( result.monarr.length > 0 ? result.monarr[0] : null )
                });
            }
        });
    }
    handleChange(value) {
        this.setState({selected:value});
        this.query(value);
    }

    render() {
        let options = this.state.date.map(obj =>
            <option key={obj}>{obj}</option>
        );
        return (
            <div>
                <div className='m-container'>
                    <div className='m-text-c' style={{height:'32px'}}>
                        <Select option={this.state.date} selected={this.state.selected} onChange={this.handleChange}/>
                    </div>
                    <div className='m-box m-text-c'>
                        截至目前营业额：{this.state.currentAmount}&emsp;&emsp;上月同期营业额：{this.state.previousAmount}
                    </div>
                    <div className='m-box'>
                        <Chart current={this.state.currentData} previous={this.state.previousData}/>
                    </div>
                    <table className='chart-table'>
                        <tbody>
                            <tr><td></td><td>本月</td><td>上月</td><td>涨幅</td></tr>
                            <tr>
                                <td>营业额</td>
                                <td>{this.state.current.business_total}</td>
                                <td>{this.state.previous.business_total}</td>
                                <td className={this.state.statistics.business_total > 0 ? 'm-red' : 'm-blue'}>
                                    {this.state.statistics.business_total > 0 ? '+' : null}
                                    {this.state.statistics.business_total}%
                                </td>
                            </tr>
                            <tr>
                                <td>订单数</td>
                                <td>{this.state.current.item_total}</td>
                                <td>{this.state.previous.item_total}</td>
                                <td className={this.state.statistics.item_total > 0 ? 'm-red' : 'm-blue'}>
                                    {this.state.statistics.item_total > 0 ? '+' : null}
                                    {this.state.statistics.item_total}%
                                </td>
                            </tr>
                            <tr>
                                <td>取消单</td>
                                <td>{this.state.current.cancel_item_total}</td>
                                <td>{this.state.previous.cancel_item_total}</td>
                                <td className={this.state.statistics.cancel_item_total > 0 ? 'm-red' : 'm-blue'}>
                                    {this.state.statistics.cancel_item_total > 0 ? '+' : null}
                                    {this.state.statistics.cancel_item_total}%
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}