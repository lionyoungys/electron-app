/**
 * 合作门店界面组件
 * @author yangyunlong
 */

import React, {Component} from 'react';
import Crumb from '../UI/crumb/App';
import './App.css';


export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {data:[]};
    }

    componentDidMount() {
        axios.post(api.U('teamwork'), api.D({token:this.props.token}))
        .then(response => {
            console.log(response.data);
            api.V(response.data) && this.setState({data:response.data.result});
        });
    }

    render() {
        let html = this.state.data.map(obj => 
            <tr className='bd-lightgrey' key={obj.accept_id}>
                <td><img src={obj.mlogo} className='teamwork-logo'/>&nbsp;&nbsp;{obj.mname}</td>
                <td>{obj.accept_id}</td>
                <td>{obj.phone_number}</td>
                <td>{obj.maddress}</td>
            </tr>
        );
        return (
            <div>
                <Crumb data={[{key:0,value:'合作门店'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div className='m-text-r' style={{position:'relative'}}>
                        <button className='m-btn confirm middle' type='button'>+ 新增合作门店</button>
                        <Query/>
                    </div>
                    <div className='m-box'>
                        <table className='m-table m-text-c'>
                            <thead><tr className='bd-lightgrey m-bg-white'><th>名称</th><th>编号</th><th>手机号</th><th>地址</th></tr></thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

class Query extends Component {
    constructor(props) {
        super(props);
        this.state = {value:''}
    }

    render() {
        return (
            <div className='teamwork-query'>
                <i className="fa fa-times"></i>
                <div>新增合作门店</div>
                <div className='body'>
                    <div>
                        <input type='text' value={this.state.value} onChange={e => this.setState({value:e.target.value})}/>
                        <button className='m-btn confirm' type='button'>确定</button>
                        <div className='query-result'></div>
                    </div>
                </div>
            </div>
        );
    }
}