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
        this.state = {
            date:[],
            tag:[],
            time:[],
            checkedDate:'',
            checkedTime:'',
            checkedTag:'',
            page:1
        };
        this.handleClick = this.handleClick.bind(this);
        this.query = this.query.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }
    componentDidMount() {this.query()}

    handleClick(e) {
        let date = e.target.dataset.date,
            time = e.target.dataset.time;
        this.handleMouseOut();
        this.props.onClick(date, time);
    }

    handlePage(state) {
        if (state) {
            this.query(this.state.page + 1);
            this.setState({page:this.state.page + 1});
        } else {
            this.query(this.state.page - 1);
            this.setState({page:this.state.page - 1});
        }
    }

    handleMouseOver(e) {
        let date = e.target.dataset.date,
            time = e.target.dataset.time,
            tag = e.target.dataset.tag;
        this.setState({checkedDate:date,checkedTime:time,checkedTag:tag});
    }
    handleMouseOut() {this.setState({checkedDate:'',checkedTime:'',checkedTag:''})}

    query(page) {
        api.post(
            'take_time',
            {page:tool.isSet(page) ? page : this.state.page},
            response => {
                let date = [], tag = [], time = [];
                response.data.map(obj => {
                    date.push(obj.date);
                    tag.push(obj.tag);
                    time.push(obj.time);
                });
                this.setState({date:date,tag:tag,time:time});
            }
        );
    }

    render() {
        if (!this.props.show) return null;
        let date = this.state.date,
            time = this.state.time,
            tag = this.state.tag,
            html = segment.map( (obj, index) => 
                <tr key={obj} className='take-time-option'>
                    <td>{obj}</td>
                    {-1 !== obj.inArray(time[0]) ? <td data-date={date[0]} data-tag={tag[0]} data-time={obj} onClick={this.handleClick} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>可选</td> : <td className='disabled'>不可选</td>}
                    {-1 !== obj.inArray(time[1]) ? <td data-date={date[1]} data-tag={tag[1]} data-time={obj} onClick={this.handleClick} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>可选</td> : <td className='disabled'>不可选</td>}
                    {-1 !== obj.inArray(time[2]) ? <td data-date={date[2]} data-tag={tag[2]} data-time={obj} onClick={this.handleClick} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>可选</td> : <td className='disabled'>不可选</td>}
                    {-1 !== obj.inArray(time[3]) ? <td data-date={date[3]} data-tag={tag[3]} data-time={obj} onClick={this.handleClick} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>可选</td> : <td className='disabled'>不可选</td>}
                    {-1 !== obj.inArray(time[4]) ? <td data-date={date[4]} data-tag={tag[4]} data-time={obj} onClick={this.handleClick} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>可选</td> : <td className='disabled'>不可选</td>}
                    {-1 !== obj.inArray(time[5]) ? <td data-date={date[5]} data-tag={tag[5]} data-time={obj} onClick={this.handleClick} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>可选</td> : <td className='disabled'>不可选</td>}
                    {-1 !== obj.inArray(time[6]) ? <td data-date={date[6]} data-tag={tag[6]} data-time={obj} onClick={this.handleClick} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>可选</td> : <td className='disabled'>不可选</td>}
                </tr>
            );
        return (
            <div className='m-layer-bg'>
                <div className='take-time'>
                    <div>请选择取衣时间<i className='fa fa-times' onClick={this.props.onClose}></i></div>
                    <div>
                        取衣时间&nbsp;
                        <input type='text' value={this.state.checkedDate + this.state.checkedTime} className='m-text-c m-input-small long' readOnly/>
                        &nbsp;{'' == this.state.checkedTag ? null : `(${this.state.checkedTag})`}
                    </div>
                    <div>
                        <table>
                            <thead><tr>
                                <td>时间段</td>
                                <td>{tag[0]}<br/>{date[0].toSimpleMonth()}</td>
                                <td>{tag[1]}<br/>{date[1].toSimpleMonth()}</td>
                                <td>{tag[2]}<br/>{date[2].toSimpleMonth()}</td>
                                <td>{tag[3]}<br/>{date[3].toSimpleMonth()}</td>
                                <td>{tag[4]}<br/>{date[4].toSimpleMonth()}</td>
                                <td>{tag[5]}<br/>{date[5].toSimpleMonth()}</td>
                                <td>{tag[6]}<br/>{date[6].toSimpleMonth()}</td>
                            </tr></thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                    <div>
                        {1 < this.state.page && <span onClick={() => this.handlePage(false)}>上一周</span>}
                        <span onClick={() => this.handlePage(true)}>下一周</span>
                    </div>
                </div>
            </div>
        );
    }
}