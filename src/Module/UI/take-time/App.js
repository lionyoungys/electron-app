/**
 * 取衣时间组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';

//取衣时间
const segment = ['09:00~12:00', '12:00~14:00', '14:00~17:00', '17:00~20:00'];
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date:[],time:[]};
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        axios.get(api.U('take_time'))
        .then(response => {
            response.data.map(obj => {
                this.state.date.push(obj.date);
                this.state.time.push(obj.time);
            });
            this.setState({date:this.state.date,time:this.state.time});
        });
    }

    handleClick(e) {
        this.props.onClick(e.target.dataset.date, e.target.dataset.time);
    }

    render() {
        if (!this.props.show) return null;
        let date = this.state.date,
            time = this.state.time,
            html = segment.map( (obj, index) => 
                <tr key={obj} className='take-time-option'>
                    <td>{obj}</td>
                    {-1 !== obj.inArray(time[0]) ? <td data-date={date[index]} data-time={obj} onClick={this.handleClick}>可选</td> : <td className='disabled'>不可选</td>}
                    {-1 !== obj.inArray(time[1]) ? <td data-date={date[index]} data-time={obj} onClick={this.handleClick}>可选</td> : <td className='disabled'>不可选</td>}
                    {-1 !== obj.inArray(time[2]) ? <td data-date={date[index]} data-time={obj} onClick={this.handleClick}>可选</td> : <td className='disabled'>不可选</td>}
                    {-1 !== obj.inArray(time[3]) ? <td data-date={date[index]} data-time={obj} onClick={this.handleClick}>可选</td> : <td className='disabled'>不可选</td>}
                    {-1 !== obj.inArray(time[4]) ? <td data-date={date[index]} data-time={obj} onClick={this.handleClick}>可选</td> : <td className='disabled'>不可选</td>}
                    {-1 !== obj.inArray(time[5]) ? <td data-date={date[index]} data-time={obj} onClick={this.handleClick}>可选</td> : <td className='disabled'>不可选</td>}
                    {-1 !== obj.inArray(time[6]) ? <td data-date={date[index]} data-time={obj} onClick={this.handleClick}>可选</td> : <td className='disabled'>不可选</td>}
                </tr>
            );
        return (
            <div className='m-layer-bg'>
                <div className='take-time'>
                    <div>取衣时间<i className='fa fa-times' onClick={this.props.onClose}></i></div>
                    <div>
                        <table>
                            <thead><tr>
                                <td>时间段</td>
                                <td>{tool.isSet(date[0]) ? date[0].toSimpleMonth() : null}</td>
                                <td>{tool.isSet(date[1]) ? date[1].toSimpleMonth() : null}</td>
                                <td>{tool.isSet(date[2]) ? date[2].toSimpleMonth() : null}</td>
                                <td>{tool.isSet(date[3]) ? date[3].toSimpleMonth() : null}</td>
                                <td>{tool.isSet(date[4]) ? date[4].toSimpleMonth() : null}</td>
                                <td>{tool.isSet(date[5]) ? date[5].toSimpleMonth() : null}</td>
                                <td>{tool.isSet(date[6]) ? date[6].toSimpleMonth() : null}</td>
                            </tr></thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}